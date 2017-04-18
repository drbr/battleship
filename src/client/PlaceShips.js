const React = require('react');
const HTML5Backend = require('react-dnd-html5-backend');
const { DragDropContext } = require('react-dnd');

const Board = require('../boardComponents/Board');
const Ship = require('../boardComponents/Ship');
const ShipDropTarget = require('../boardComponents/ShipDropTarget');

class PlaceShips extends React.Component {
  render() {
    let playerId = this.props.playerId;

    const leftSideStyle = {
      display: 'inline-block',
      width: 200,
      height: 500,
      border: '2px solid black',
      borderRadius: 2
    };

    const shipHolderStyle = {
      backgroundColor: 'transparent'
    };

    const LeftSide = function LeftSide() {
      return (
        <div style={leftSideStyle}>
          <div style={shipHolderStyle}><Ship size={1} /></div>
          <div style={shipHolderStyle}><Ship size={3} /></div>
        </div>
      );
    }

    return (
      <div>
        <div>Place ships</div>
        <div style={{ display: 'flex' }} >
          <LeftSide />
          <Board
            cells={this.props.gameState.boardsByPlayer[playerId]}
            onCellClick={ (row, col) => {alert("cell clicked: " + row + ", " + col)}} />
          <ShipDropTarget />
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

module.exports = DragDropContext(HTML5Backend)(PlaceShips);
