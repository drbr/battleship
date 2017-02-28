import React, { Component } from 'react';
import {Cell} from './Cell';

export class Board extends Component {
  render() {
    if (!this.props.cells) {
      return null;
    }

    let grid = this.props.cells.map((row, rowIdx) => {
      return (
        <div key={rowIdx} style={{ display: 'flex' }}>
          {
            row.map((cellProps, colIdx) => {
              let onCellClick = null;
              if (this.props.onCellClick) {
                onCellClick = () => this.props.onCellClick(rowIdx, colIdx);
              }
              return <Cell {...cellProps} key={colIdx} onClick={onCellClick}/>;
            })
          }
        </div>
      );
    });

    return <div>{grid}</div>;
  }
}

Board.propTypes = {
  cells: React.PropTypes.arrayOf(React.PropTypes.arrayOf(
           React.PropTypes.shape({
             hit: React.PropTypes.bool,
             shipId: React.PropTypes.string
           }))),
  onCellClick: React.PropTypes.func
};
