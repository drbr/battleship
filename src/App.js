import React, { Component } from 'react';
import './App.css';

import { Board } from './boardComponents/Board';

const INITIAL_CELLS = [
  [{shipId:"A"}, {}, {hit:true}],
  [{shipId:"A", hit:true}, {}, {}],
  [{shipId:"A", hit:true}, {shipId:"B", hit:true}, {shipId:"B"}]
];

class App extends Component {

  state = { cells: INITIAL_CELLS };

  onCellClick = (row, col) => {
    let cells = this.state.cells;
    cells[row][col].hit = !cells[row][col].hit;
    // TODO: State objects should be immutable; we should use the React immutability helpers
    // to create a shallow copy of the cells with only the specific one changed
    this.setState(cells);
  };

  render() {
    return (
      <div className="App">
        <Board cells={this.state.cells} onCellClick={this.onCellClick} />
      </div>
    );
  }
}

export default App;
