import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import RegisterForm from './components/RegisterForm';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
	},
	container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
}));

export default function App() {
	return (
		<Router>
			<Switch>
				<Route path="/register">
					<Register />
				</Route>
			</Switch>
		</Router>
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