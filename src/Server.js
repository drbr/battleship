const WebSocket = require('ws');
const _ = require('underscore');
const StateMachine = require('./stateMachine/StateMachine');
const {PHASES, ACTIONS} = require('./stateMachine/Phases');
const {MESSAGE_TYPE} = require('./messages');

// legacy state
const state = {
  player0Board: [[{shipId:"A"}, {}, {}], [{}, {}, {}], [{}, {}, {}] ],
  player1Board: [[{shipId:"B"}, {}, {}], [{}, {}, {}], [{}, {}, {}] ]
}


function printBoard(board) {
  for (row of board) {
    let rowStr = '';
    for (cell of row) {
      rowStr += cell.hit ? 'X' : '.';
      rowStr += cell.shipId + "\t";
    }
    console.log(rowStr);
  }
}

function printState(state) {
  if (state.boardsByPlayer) {
    for (let playerId in state.boardsByPlayer) {
      console.log(`Player ${playerId} board:`);
      printBoard(state.boardsByPlayer[playerId]);
    }
  }
}

const clients = {}

const onCellClick = (parsedMessage, clientId) => {
  let {row, col} = parsedMessage;
  console.log('Player ' + clientId + ' clicked a cell. Before update:');
  let cells = clientId === '0'? state.player0Board : state.player1Board;
  cells[row][col].hit = !cells[row][col].hit;

  console.log('After update:');
  return cells;
};

const wss = new WebSocket.Server({ port: 8080, clientTracking: true });

wss.on('connection', function connection(ws) {

  ws.id = String(_(clients).size());
  clients[ws.id] = ws;

  let newState;
  let action = {
    name: ACTIONS.JoinGame,
    playerId: ws.id
  };

  try {
    newState = StateMachine.doActionAndBroadcast(action, clients);
  } catch (e) {
    console.log(e);
    ws.close(1000, e.message);
    delete clients[ws.id];
    return;
  }
  printState(newState);


  ws.send(JSON.stringify({
    type: MESSAGE_TYPE.CLIENT_ID,
    id: ws.id
  }));
  

  sendInitialBoardState(ws, state);

  ws.on('close', function (code, reason) {
    console.log(`Client ${ws.id} closed for reason: ${reason} (${code})`);
    delete clients[ws.id];
  });


  ws.on('message', function incoming(message) {
    console.log('received:');
    console.log(JSON.parse(message));

    var parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
      case 'cellClick':
        var newBoard = onCellClick(parsedMessage, ws.id);

        for (let clientId in clients) {
          console.log('clientid: ' + clientId);
          console.log('wsid: ' + ws.id);
          var response = {
            type: 'boardState',
            player: (clientId === ws.id) ? 'me' : 'you',
            board: newBoard
          };
          clients[clientId].send(JSON.stringify(response));
        }
        break;

      default:console.log("not recognized: %s", parsedMessage);
    }
  });



});

function sendInitialBoardState(client, state) {
  let myBoard = client.id === '0' ? state.player0Board : state.player1Board;
  let yourBoard = client.id === '0' ? state.player1Board : state.player0Board;
  client.send(JSON.stringify({
    type: 'boardState',
    player: 'me',
    board: myBoard
  }));
  client.send(JSON.stringify({
    type: 'boardState',
    player: 'you',
    board: yourBoard
  }));
}


