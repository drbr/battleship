import './App.css';

const React = require('react');
const Board = require('./boardComponents/Board');
const WaitForPlayers = require('./client/WaitForPlayers');
const PlaceShips = require('./client/PlaceShips');

const ipAddress = require('../ipAddress');

const {MESSAGE_TYPE} = require('./messages');
const {PHASES} = require('./stateMachine/Phases');

const ComponentForPhase = {
  [PHASES.WaitForPlayers]: WaitForPlayers,
  [PHASES.PlaceShips]: PlaceShips
};

class App extends React.Component {

  socket = null;

  state = {
    playerId: null,
    gameState: null
  };

  startWebSocket = () => {
    this.socket = new WebSocket(`ws://${ipAddress}:8080`);

    this.socket.onmessage = (event) => {
      var parsedMessage = JSON.parse(event.data)
      console.log(parsedMessage);

      switch (parsedMessage.type) {
        //TODO get rid of this
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
        this.setState({gameState: parsedMessage.state})
          break;
        default:
          console.log("errorrrrr");
      }
    }

    this.socket.onclose = (event) => {
      alert(event.reason);
    }
  };


  getViewComponentForState() {
    if (!this.state.gameState) {
      return <ConnectToServer connect={this.startWebSocket} />;
    }

    let component = ComponentForPhase[this.state.gameState.phase];
    if (component) {
      return React.createElement(component, { gameState: this.state.gameState });
    }

    console.log("couldn't figure out what component to get");
    return null;
  }

  render() {
    return (
      <div className="App">
        <h1>BattleBuoys!!!!!!!!!!!!</h1>
        {this.getViewComponentForState()}
      </div>
    );
  }
}

class ConnectToServer extends React.Component {
  render() {
    return <button onClick={this.props.connect}>Start</button>;
  }
}

export default App;