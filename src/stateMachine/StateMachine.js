const _ = require('underscore');

const { MESSAGE_TYPE }= require('../messages');

const {PHASES, ACTIONS } = require('./Phases');
const JoinGame = require('./actions/JoinGame');
const PlaceShips = require('./actions/PlaceShips');

let state = {
  phase: PHASES.WaitForPlayers,
  players: []
};

const PHASE_ACTIONS = {
  [PHASES.WaitForPlayers]: {
    [ACTIONS.JoinGame]: JoinGame
  },
  [PHASES.PlaceShips]: {
    [ACTIONS.PlaceShips]: PlaceShips
  }
}

const STATE_TRANSFORMERS = {
  [PHASES.WaitForPlayers]: (state, clientId) => state,
  [PHASES.PlaceShips]: (state, clientId) => ({
    phase: state.phase,
    boardsByPlayer: _.pick(state.boardsByPlayer, clientId)
  })
}



function doAction(action) {
  let validActions = PHASE_ACTIONS[state.phase];
  let actionProcessor = validActions[action.name];
  if (!actionProcessor) {
    let errorMsg = `Action ${action.name} is not valid for phase ${state.phase}`;
    console.log(errorMsg);
    throw new Error(errorMsg);
  }
  let newState = actionProcessor(state, action);
  console.log(newState);
  state = newState;
  return state;
}

function doActionAndBroadcast(action, clients) {
  let newState = doAction(action);
  for (let clientId in clients) {
    let clientStateView = STATE_TRANSFORMERS[newState.phase](newState, clientId);
    let message = { type: MESSAGE_TYPE.STATE_INFO, state: clientStateView };
    clients[clientId].send(JSON.stringify(message));
  }
  return newState;
}

module.exports = { doActionAndBroadcast };