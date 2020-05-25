import { USER_ACTION_TYPES } from "../actions/user.actions";

const user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export const authentication = (state = initialState, action) => {
    switch (action.type) {
        case USER_ACTION_TYPES.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: action.user
            };
        case USER_ACTION_TYPES.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                user: action.user
            };
        default:
            return state;
    }
}