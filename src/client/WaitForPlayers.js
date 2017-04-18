const React = require('react');

class WaitForPlayers extends React.Component {
  render() {
    let players = this.props.gameState.players.length;
    return <div>Waiting for players... currently: {players}</div>;
  }
}

WaitForPlayers.propTypes = {
  gameState: React.PropTypes.shape({
    players: React.PropTypes.array
  })
};

module.exports = WaitForPlayers;