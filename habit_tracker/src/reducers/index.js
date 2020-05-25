import { users } from './users.reducer';
import { alert } from './alert.reducer';
import { authentication } from './authentication.reducer'
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    authentication,
    users,
    alert
});

export default rootReducer;