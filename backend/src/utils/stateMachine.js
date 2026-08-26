/**
 * RecoverX Recovery Case State Machine Engine
 * Enforces valid state transitions and prevents random status mutations.
 */

const RECOVERY_STATES = [
  'DETECTED',
  'ANALYZING',
  'PREDICTED',
  'RECOMMENDED',
  'POLICY_CHECK',
  'ACTION_APPROVED',
  'ACTION_EXECUTING',
  'RECOVERY_SUCCESS',
  'RECOVERY_FAILED',
  'ESCALATED',
  'STOPPED'
];

const VALID_TRANSITIONS = {
  DETECTED: ['ANALYZING', 'STOPPED'],
  ANALYZING: ['PREDICTED', 'STOPPED'],
  PREDICTED: ['RECOMMENDED', 'STOPPED'],
  RECOMMENDED: ['POLICY_CHECK', 'STOPPED'],
  POLICY_CHECK: ['ACTION_APPROVED', 'ESCALATED', 'STOPPED'],
  ACTION_APPROVED: ['ACTION_EXECUTING', 'STOPPED', 'ESCALATED'],
  ACTION_EXECUTING: ['RECOVERY_SUCCESS', 'RECOVERY_FAILED'],
  RECOVERY_FAILED: ['POLICY_CHECK', 'ESCALATED', 'STOPPED'],
  ESCALATED: ['ACTION_APPROVED', 'STOPPED'],
  RECOVERY_SUCCESS: [], // Terminal State
  STOPPED: []           // Terminal State
};

/**
 * Validates whether a state transition from `currentState` to `nextState` is permitted.
 */
function isValidTransition(currentState, nextState) {
  if (!RECOVERY_STATES.includes(currentState) || !RECOVERY_STATES.includes(nextState)) {
    return false;
  }
  const permitted = VALID_TRANSITIONS[currentState] || [];
  return permitted.includes(nextState);
}

module.exports = {
  RECOVERY_STATES,
  VALID_TRANSITIONS,
  isValidTransition
};
