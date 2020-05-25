import { ALERT_ACTION_TYPES } from "../actions/alert.actions";

export const alert = (state = {}, action) => {
    switch (action.type) {
        case ALERT_ACTION_TYPES.SUCCESS:
            return {
                type: 'alert-success',
                message: action.message
            };
        case ALERT_ACTION_TYPES.ERROR:
            return {
                type: 'alert-danger',
                message: action.message
            };
        case ALERT_ACTION_TYPES.CLEAR:
            return {};
        default:
            return state;
    }
}