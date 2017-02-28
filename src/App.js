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

  state = { cells: INITIAL_CELLS };

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
          this.setState({ cells: parsedMessage.board})
      }
    }
  }

  sendWebSocket = () => {
    this.socket.send(JSON.stringify({
        type: 'cellClick',
        row: 2,
        col: 2
    }));
  }

  render() {
    return (
      <div>
      <div className="App">
        <Board cells={this.state.cells} onCellClick={this.onCellClick} />
      </div>
      <div onClick={this.startWebSocket}>
        Click Me to open web socket
      </div>
      <div onClick={this.sendWebSocket}>
        Click me to send on a web socket!!!
      </div>
      </div>
    );
  }
}

export default App;
