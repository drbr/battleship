import React, { Component } from 'react';

const CELL_SIZE = 30;

const DEFAULT_STYLE = {
  height: CELL_SIZE,
  width: CELL_SIZE
};

export class Cell extends Component {
  state = { hovered: false };

  boundOnMouseEnter = () => this.setState({ hovered: true });
  boundOnMouseLeave = () => this.setState({ hovered: false });

  render() {
    let style = {
      backgroundColor: (this.props.hit || this.state.clicked) ? 'rgb(255, 0, 0)' : null,
      border: this.state.hovered ? '2px solid black' : '2px solid transparent',
      ...DEFAULT_STYLE
    };

    return (
      <div style={style}
           onClick={this.props.onClick}
           onMouseEnter={this.boundOnMouseEnter}
           onMouseLeave={this.boundOnMouseLeave} >
        { this.props.shipId }
      </div>
    );
  }
}

Cell.propTypes = {
  hit: React.PropTypes.bool,
  shipId: React.PropTypes.string,
  onClick: React.PropTypes.func.isRequired
};