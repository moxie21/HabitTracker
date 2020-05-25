import { userService } from "../services/user.service"
import { alertActions } from "./alert.actions"
import { history } from "../helpers/history"

export const USER_ACTION_TYPES = {
    LOGIN_REQUEST: 'USERS_LOGIN_REQUEST',
    LOGIN_SUCCESS: 'USERS_LOGIN_SUCCESS',
    LOGIN_FAILURE: 'USERS_LOGIN_FAILURE',

    LOGOUT: 'USERS_LOGOUT',
    
    GETALL_REQUEST: 'USERS_GETALL_REQUEST',
    GETALL_SUCCESS: 'USERS_GETALL_SUCCESS',
    GETALL_FAILURE: 'USERS_GETALL_FAILURE',

    REGISTER_REQUEST: 'USERS_REGISTER_REQUEST',
    REGISTER_SUCCESS: 'USERS_REGISTER_SUCCESS',
    REGISTER_FAILURE: 'USERS_REGISTER_FAILURE',
}

const login = (email, password, onSuccess, onFailure) => {
    const request = user => ({ type: USER_ACTION_TYPES.LOGIN_REQUEST, user })
    const success = user => ({ type: USER_ACTION_TYPES.LOGIN_SUCCESS, user })
    const failure = error => ({ type: USER_ACTION_TYPES.LOGIN_FAILURE, error })
    
    return dispatch => {
        dispatch(request({ email }));

        userService.login(email, password)
            .then(
                user => {
                    dispatch(success(user));
                    onSuccess();
                    history.push('/');
                }
            )
            .catch(error => {
                dispatch(failure(error));
                dispatch(alertActions.error(error));
                onFailure();
            });
    };
}

const logout = () => {
    userService.logout();
    return {
        type: USER_ACTION_TYPES.LOGOUT
    };
}

const getAll = () => {
    const request = () => ({ type: USER_ACTION_TYPES.GETALL_REQUEST })
    const success = users => ({ type: USER_ACTION_TYPES.GETALL_SUCCESS, users })
    const failure = error => ({ type: USER_ACTION_TYPES.GETALL_FAILURE, error })

    return dispatch => {
        dispatch(request());

        userService.getAll()
            .then(users => dispatch(success(users)))
            .catch(error => dispatch(failure(error)));
    }
}

const register = (userData, onSuccess) => {
    const request = user => ({ type: USER_ACTION_TYPES.REGISTER_REQUEST, user })
    const success = user => ({ type: USER_ACTION_TYPES.REGISTER_SUCCESS, user })
    const failure = error => ({ type: USER_ACTION_TYPES.REGISTER_FAILURE, error })

    return dispatch => {
        dispatch(request());

        userService.register(userData)
            .then(
                user => {
                    dispatch(success(user));
                    onSuccess();
                }
                // add alerts here
            )
            .catch(error => dispatch(failure(error)));
    }
}

export const USER_ACTIONS = {
    login,
    logout,
    getAll,
    register
}