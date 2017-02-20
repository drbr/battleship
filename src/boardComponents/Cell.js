import React, { Component } from 'react';

const CELL_SIZE = 30;

const DEFAULT_STYLE = {
  border: '2px solid black',
  height: CELL_SIZE,
  width: CELL_SIZE
};

export class Cell extends Component {
  render() {
    let style = {
      backgroundColor: this.props.hit ? 'red': null,
      ...DEFAULT_STYLE
    };
    return <div style={style} onClick={this.props.onClick}>
      { this.props.shipId }
    </div>;
  }
}

Cell.propTypes = {
  hit: React.PropTypes.bool,
  shipId: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired
};
