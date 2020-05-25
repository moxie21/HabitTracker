import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Router, Route } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import { ToastProvider } from 'react-toast-notifications';
import { history } from './helpers/history';
import { alertActions } from './actions/alert.actions';
import { PrivateRoute } from './components/PrivateRoute';
import { Homepage } from './pages/Homepage';
import Habits from './pages/Habits';
import Tasks from './pages/Tasks';
import NavbarLogged from './components/NavbarLogged';
import NavbarNotLogged from './components/NavbarNotLogged';
import HighlightsCalendar from './components/HighlightsCalendar';

function App(props) {
    const { dispatch, alert } = props;
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => setLoggedIn(localStorage.getItem('user') && localStorage.getItem('user').length));

    history.listen((location, action) => {
        dispatch(alertActions.clear());
    });

    return (
        <ToastProvider>
            <div className="jumbotron">
                {/* <div className="App">
                    <Register />
                </div> */}
                <div className="container">
                    <div className="col-sm-8 col-sm-offset-2">
                        {
                            alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>
                        }
                        <Router history={history}>
                            <div>
                                {loggedIn ? <NavbarLogged /> : <NavbarNotLogged />}
                                <br/><br/><br/><br/><br/>
                                <PrivateRoute exact path="/" component={Homepage} />
                                <PrivateRoute path="/habits" component={Habits} />
                                <PrivateRoute path='/tasks' component={Tasks} />
                                <PrivateRoute path="/highlights" component={HighlightsCalendar} />
                                <Route path="/register" component={Register} />
                                <Route path="/login" component={Login} />
                            </div>
                        </Router>
                    </div>
                </div>
            </div>
        </ToastProvider>
    );
}

const mapStateToProps = state => {
    const { alert } = state;

    return { alert };
}

export default connect(mapStateToProps)(App);