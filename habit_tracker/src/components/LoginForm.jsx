import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import { TextField, Button, Grid, Container, } from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import { USER_ACTIONS } from "../actions/user.actions";

const useStyles = makeStyles((theme) => ({
	root: {
		// display: "block",
		// flexWrap: "wrap"
	},
	margin: {
		// margin: theme.spacing(1),
	},
	withoutLabel: {
		// marginTop: theme.spacing(3),
	},
	textField: {
		width: 400,
		marginBottom: theme.spacing(5),
		/* "& .MuiFormLabel-root": {
			color: "#B3B3B3",
		}, */
		"& label.Mui-focused": {
			color: "#3DC1C1",
			borderBottomColor: "#3DC1C1"
		},
		/* "& .MuiInput-underline:before": {
			borderBottomColor: "#B3B3B3"
		}, */
		"& .MuiInput-underline:after": {
			borderBottomColor: "#3DC1C1",
		},
		"& .MuiOutlinedInput-root": {
			"&.Mui-focused fieldset": {
				borderColor: "#3DC1C1",
			},
		},
	},
	datePicker: {
		width: 400,
		marginBottom: theme.spacing(5),
		"& label.Mui-focused": {
			color: "#3DC1C1",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "#3DC1C1",
		},
		"& .MuiOutlinedInput-root": {
			"&.Mui-focused fieldset": {
				borderColor: "#3DC1C1",
			},
		}
	},
	formControl: {
		minWidth: 400,
		marginBottom: theme.spacing(5),
		"& label.Mui-focused": {
			color: "#3DC1C1",
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: "#3DC1C1",
		},
	},
}));

const PrimaryButton = withStyles((theme) => ({
	root: {
		display: "block",
		background: "linear-gradient(45deg, #3CAA9D 30%, #1EE0D8 90%)",
		borderRadius: 3,
		border: 0,
		color: "#FFFFFF",
		height: 48,
		padding: "0 30px",
		boxShadow: "0 3px 5px 2px #e5e5e5",
		marginTop: theme.spacing(3),
	},
}))(Button);

const initialValues = {
	email: "",
    password: "",
    submitted: false
};

const LoginForm = (props) => {
	const classes = useStyles();
	const { addToast } = useToasts();
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(USER_ACTIONS.logout());
	}, []);

	const validate = (fieldValues = values) => {
        let temp = {};
        
		if ("email" in fieldValues) {
			temp.email = /^$|.+@.+..+/.test(fieldValues.email) && fieldValues.email ? "" : "Please enter a valid Email";
		}
		if ("password" in fieldValues) {
			temp.password = fieldValues.password ? "" : "This field is required.";
		}
		setErrors({ ...temp });

		if (fieldValues === values) {
			return Object.values(temp).every(s => s === "");
		}
	};

	const resetForm = () => {
		setValues({...initialValues});
		setErrors({});
		setSelectedDate(new Date());
	};

	const handleInputChange = e => {
		const { name, value } = e.target;
		const fieldValue = { [name]: value };

		setValues({
			...values,
			...fieldValue,
		});

		validate(fieldValue);
	};

	const handleSubmit = e => {
		e.preventDefault();
		
		if (validate()) {
			const onSuccess = () => {
				addToast("Authentication was successfull", { appearance: "success", autoDismiss: true });
				resetForm();
			};
			const onFailure = () => {
				addToast("Incorrect email or password", { appearance: "error", autoDismiss: true });
			};
            
            setValues({
                ...values,
                submitted: true
            });

            const { email: Email, password: Password } = values;

			dispatch(USER_ACTIONS.login(Email, Password, onSuccess, onFailure));
		}
	};

	return (
		<React.Fragment>
			{/* <CssBaseline /> */}
			<Container maxWidth="sm">
				<form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Grid container>
						<Grid item xs={12}>
							<TextField
								className={classes.textField}
								label="Email"
								name="email"
								value={values.email}
								onChange={handleInputChange}
								{...(errors.email && { error: true, helperText: errors.Email })}
							/>
							<TextField
								className={classes.textField}
								label="Password"
								name="password"
								value={values.password}
								onChange={handleInputChange}
								{...(errors.password && {
									error: true,
									helperText: errors.password,
								})}
								type="Password"
								autoComplete="current-Password"
							/>
							<Grid>
								<PrimaryButton
									variant="contained"
									className={classes.margin}
									type="submit"
								>
									Login
					  			</PrimaryButton>
							</Grid>
						</Grid>
					</Grid>
				</form>
			</Container>
		</React.Fragment>
	);
}

const mapStateToProps = state => ({
	user: state.user
});

export default connect(mapStateToProps)(LoginForm);