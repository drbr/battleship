const React = require('react');

class WaitForPlayers extends React.Component {
  render() {
    let players = this.props.gameState.players.length;
    return <div>Waiting for players... currently: {players}</div>;
  }
}

module.exports = WaitForPlayers;