const WebSocket = require('ws');


const state = {
	player0Board: [[{shipId:"A"}, {}, {}], [{}, {}, {}], [{}, {}, {}] ],
	player1Board: [[{shipId:"B"}, {}, {}], [{}, {}, {}], [{}, {}, {}] ]
}

function printBoard(board) {
	for (row in board) {
		let rowStr = '';
		for (cell in row) {
			rowStr += cell.hit ? 'X' : '.';
		}
		console.log(rowStr);
	}
}

function printState() {
	console.log('Player 0 board:');
	printBoard(state.player0Board);
	console.log('Player 1 board:');
	printBoard(state.player1Board);
}

const clients = []

const onCellClick = (parsedMessage, clientId) => {
	let {row, col} = parsedMessage;
	console.log('Player ' + clientId + ' clicked a cell. Before update:');
	printState();
	let cells = clientId === 0? state.player0Board : state.player1Board;
	cells[row][col].hit = !cells[row][col].hit;

	console.log('After update:');
	printState();
	return cells;
};

const wss = new WebSocket.Server({ port: 8080, clientTracking: true });

// Broadcast to all.
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
    	console.log("A client:");
    	console.log(client);
      client.send(data);
    }
  });
};


wss.on('connection', function connection(ws) {

	ws.id = clients.length;
	clients.push(ws);

  ws.on('message', function incoming(message) {
    console.log('received:');
    console.log(JSON.parse(message));

    var parsedMessage = JSON.parse(message);

  	switch (parsedMessage.type) {
  		case 'cellClick':
  			var newBoard = onCellClick(parsedMessage, ws.id);

  			clients.forEach( client => {
			    var response = {
			    	type: 'boardState',
			    	player: (client.id === ws.id) ? 'me' : 'you',
			    	board: newBoard
			    };
	  			client.send(JSON.stringify(response));
  			});
  			break;

  		default:console.log("not recognized: %s", parsedMessage);
  	}
  });

  ws.send(JSON.stringify({
  	type: 'clientId',
  	id: ws.id
  }));

  if (ws.id === 0) {
  	ws.send(JSON.stringify({
  		type: 'boardState',
  		player: 'me',
  		board: state.player0Board
  	}));
  	ws.send(JSON.stringify({
  		type: 'boardState',
  		player: 'you',
  		board: state.player1Board
  	}));
  } else {
  	ws.send(JSON.stringify({
  		type: 'boardState',
  		player: 'me',
  		board: state.player1Board
  	}));
  	ws.send(JSON.stringify({
  		type: 'boardState',
  		player: 'you',
  		board: state.player0Board
  	}));
  }
});