import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import RegisterForm from './components/RegisterForm';
import Articles from './components/Articles';
import DailyTasks from './components/DailyTasks';
import { ToastProvider } from 'react-toast-notifications';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
	},
	container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
}));

Date.prototype.getDayOfTheWeek = function () {
    return this.getDay() === 0 ? 6 : this.getDay() - 1;
}

export default function App() {
	return (
		<ToastProvider>
			<Router>
				<Switch>
					<Route path="/register">
						<Register />
					</Route>
					<Route path="/">
						<DailyTasks/>
					</Route>
				</Switch>
			</Router>
		</ToastProvider>
	);
}

function Register() {
	return (
		<div className="App">
			<React.Fragment>
				<CssBaseline />
				<Container maxWidth="sm">
					<RegisterForm />
				</Container>
			</React.Fragment>
		</div>
	);
}