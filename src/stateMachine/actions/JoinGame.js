const _ = require('underscore');

const { PHASES } = require('../Phases');

const BOARD_SIZE = 4;

function JoinGame(state, action) {
  if (state.players.length < 1) {
    return {
      phase: PHASES.WaitForPlayers,
      players: state.players.concat(action.playerId)
    };
  } else {
    let players = state.players.concat(action.playerId);
    let boards = generateStartingBoard(players);

    return {
      phase: PHASES.PlaceShips,
      boardsByPlayer: boards
    };
  }
}

function generateStartingBoard(players) {
  let boards = {};
  for (let playerId of players) {
    boards[playerId] = _.times(BOARD_SIZE,
        () => _.times(BOARD_SIZE,
            idx => ({ shipId: idx, hit: false })));
  }
  return boards;
}

module.exports = JoinGame;