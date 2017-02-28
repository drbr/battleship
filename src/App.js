import React, { Component } from 'react';
import './App.css';

import { Board } from './boardComponents/Board';

const INITIAL_CELLS = [
  [{shipId:"A"}, {}, {hit:true}],
  [{shipId:"A", hit:true}, {}, {}],
  [{shipId:"A", hit:true}, {shipId:"B", hit:true}, {shipId:"B"}]
];

class App extends Component {

  socket = null;

  state = {
    myBoard: [...INITIAL_CELLS],
    opponentBoard: [...INITIAL_CELLS],
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
    this.socket = new WebSocket('ws://localhost:8080');

    this.socket.onmessage = (event) => {
      var parsedMessage = JSON.parse(event.data)

      switch (parsedMessage.type) {
        case 'boardState':
          if (parsedMessage.player === 'me') {
            this.setState({ myBoard: parsedMessage.board });
          } else {
            this.setState({ opponentBoard: parsedMessage.board });
          }
        break;
        case 'clientId':
          this.setState({playerId: parsedMessage.id});
      }
    }
  };

  render() {
    return (
      <div>
      <div className="App">
        <h1>You are player {this.state.playerId}</h1>
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
