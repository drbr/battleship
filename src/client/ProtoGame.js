import '../App.css';

const React = require('react');
const Board = require('../boardComponents/Board');
const ipAddress = require('../../ipAddress');

const {MESSAGE_TYPE} = require('../messages');

class ProtoGame extends React.Component {

  socket = null;

  state = {
    myBoard: null,
    opponentBoard: null,
    playerId: null
  };

  onCellClick = (row, col) => {
    this.socket.send(JSON.stringify({
      type: 'cellClick',
      row: row,
      col: col
    }));
  };

  startWebSocket = () => {
    this.socket = new WebSocket(`ws://${ipAddress}:8080`);

    this.socket.onmessage = (event) => {
      var parsedMessage = JSON.parse(event.data)
      console.log(parsedMessage);

      switch (parsedMessage.type) {
        case 'boardState':
          if (parsedMessage.player === 'me') {
            this.setState({ myBoard: parsedMessage.board });
          } else {
            this.setState({ opponentBoard: parsedMessage.board });
          }
        break;
        case MESSAGE_TYPE.CLIENT_ID:
          this.setState({playerId: parsedMessage.id});
          break;
        case MESSAGE_TYPE.STATE_INFO:
          this.setState({phase: parsedMessage.state.phase})
          break;
        default:
          console.log("errorrrrr");
      }
    }
  };

  render() {
    return (
      <div>
        <div className="App">
          <h1>You are player {this.state.playerId}</h1>
          <div>
            Phase: {this.state.phase}
          </div>
          <Board cells={this.state.myBoard} onCellClick={this.onCellClick} />
          <Board cells={this.state.opponentBoard}/>
        </div>
        <div onClick={this.startWebSocket}>
          Click Me to open web socket
        </div>
      </div>
    );
  }
}

export default App;
