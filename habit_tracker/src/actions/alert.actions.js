export const ALERT_ACTION_TYPES = {
    SUCCESS: 'ALERT_SUCCESS',
    ERROR: 'ALERT_ERROR',
    CLEAR: 'ALERT_CLEAR'
}

const success = message => ({ type: ALERT_ACTION_TYPES.SUCCESS, message })
const error = message => ({ type: ALERT_ACTION_TYPES.ERROR, message })
const clear = () => ({ type: ALERT_ACTION_TYPES.CLEAR })

export const alertActions = {
    success,
    error,
    clear
}