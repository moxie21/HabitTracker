import { USER_ACTION_TYPES } from "../actions/user.actions";

export const users = (state = {}, action) => {
    switch (action.type) {
        case USER_ACTION_TYPES.GETALL_REQUEST:
            return {
                loading: true
            };
        case USER_ACTION_TYPES.GETALL_SUCCESS:
            return {
                items: action.users
            };
        case USER_ACTION_TYPES.LOGIN_FAILURE:
            return {
                error: action.error
            };
        default:
            return state;
    }
}