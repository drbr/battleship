const {PHASES, ACTIONS} = require('./Phases');
const _ = require('underscore');

let state = {
  phase: PHASES.WaitForPlayers,
  players: []
};

const StateProcessor = {
  [PHASES.WaitForPlayers]: {
    [ACTIONS.JoinGame]: JoinGame
  },
  [PHASES.PlaceShips]: {
    [ACTIONS.PlaceShips]: PlaceShips
  }
}

function doAction(action) {
  let validActions = StateProcessor[state.phase];
  let actionProcessor = validActions[action.name];
  if (!actionProcessor) {
    console.log(`Action ${action.name} is not valid for phase ${state.phase}`);
    return null;
  }
  let newState = actionProcessor(action);
  console.log(newState);
  state = newState;
  return state;
  // broadcast new state to clients, after passing through a robot in disguise
}

function JoinGame(action) {
  if (state.players.length < 1) {
    return {
      phase: PHASES.WaitForPlayers,
      players: state.players.concat(action.playerId)
    };
  } else {
    const BOARD_SIZE = 4;
    let boards = {};
    let players = state.players.concat(action.playerId);
    for (let playerId of players) {
      boards[playerId] = _.times(BOARD_SIZE,
          () => _.times(BOARD_SIZE,
              idx => ({ shipId: idx, hit: false })));
    }

    return {
      phase: PHASES.PlaceShips,
      boardsByPlayer: boards
    };
  }
}

function PlaceShips(action) {

}

module.exports = {doAction};