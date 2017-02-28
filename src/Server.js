const WebSocket = require('ws');

const INITIAL_CELLS = [
  [{shipId:"A"}, {}, {hit:true}],
  [{shipId:"A", hit:true}, {}, {}],
  [{shipId:"A", hit:true}, {shipId:"B", hit:true}, {shipId:"B"}]
];

const state = {
	player1Board: [...INITIAL_CELLS],
	player2Board: [...INITIAL_CELLS]
}

const onCellClick = (parsedMessage) => {
	let {row, col} = parsedMessage;
    let cells = state.player1Board;
    cells[row][col].hit = !cells[row][col].hit;
    // TODO: State objects should be immutable; we should use the React immutability helpers
    // to create a shallow copy of the cells with only the specific one changed
    console.log('Clicked on the cell');
    var response = {
    	type: 'boardState',
    	player: 1,
    	board: cells
    };

    return JSON.stringify(response);
  };

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    console.log('received:');
    console.log(JSON.parse(message));

    var parsedMessage = JSON.parse(message);

  	switch (parsedMessage.type) {
  		case 'cellClick':
  			ws.send(onCellClick(parsedMessage));
  			break;
  		default:console.log("not recognized: %s", parsedMessage);
  	}


  });

  //ws.send('something');
});