const React = require('react');
const Board = require('../boardComponents/Board');
const Ship = require('../boardComponents/Ship');

class PlaceShips extends React.Component {
  render() {
    let playerId = this.props.playerId;

    const leftSideStyle = {
      width: 200,
      height: 500,
      backgroundColor: 'lightGrey'
    };
    return (
      <div>
        <div>Place ships</div>
        <div style={{ display: 'flex' }} >
          <div style={leftSideStyle}>
            <Ship size={1} />
            <Ship size={3} />
          </div>
          <Board
            cells={this.props.gameState.boardsByPlayer[playerId]}
            onCellClick={ (row, col) => {alert("cell clicked: " + row + ", " + col)}} />
        </div>
      </div>
    );
  }
}

PlaceShips.propTypes = {
  gameState: React.PropTypes.shape({
    players: React.PropTypes.array,
    boardsByPlayer: React.PropTypes.object
  }),
  playerId: React.PropTypes.string
};

module.exports = PlaceShips;