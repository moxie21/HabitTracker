import React, { useState, Fragment } from "react";
import { toServerDateTimeFormat } from '../helpers/dateFunctions';
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useToasts } from "react-toast-notifications";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { TextField, Button, Grid, CssBaseline, Container} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
import { USER_ACTIONS } from "../actions/user.actions";
import { Redirect } from "react-router-dom";

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
		boxShadow: "0 3px 5px 2px #E5E5E5",
		marginTop: theme.spacing(3),
	},
}))(Button);

const ResetButton = withStyles((theme) => ({
	root: {
		display: "block",
		background: "linear-gradient(45deg, #E5E5E5 30%, #FFFFFF 90%)",
		borderRadius: 3,
		border: 0,
		color: "#3CAA9D",
		height: 48,
		padding: "0 30px",
		boxShadow: "0 3px 5px 2px #E5E5E5",
		marginTop: theme.spacing(3),
	},
}))(Button);

const initialValues = {
	firstName: "",
	lastName: "",
	email: "",
	password: "",
	country: "",
	dateOfBirth: new Date(),
	role: "User"
};

const RegisterForm = ({...props}) => {
	const classes = useStyles();
	const { addToast } = useToasts();
	const [values, setValues] = useState(initialValues);
	const [errors, setErrors] = useState({});
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [redirect, setRedirect] = useState(false);
	const dispatch = useDispatch();

	const validate = (fieldValues = values) => {
		let temp = {};

		if ("firstName" in fieldValues) {
			temp.firstName = fieldValues.firstName ? "" : "This field is required.";
		}
		if ("lastName" in fieldValues) {
			temp.lastName = fieldValues.lastName ? "" : "This field is required.";
		}
		if ("email" in fieldValues) {
			temp.email = /^$|.+@.+..+/.test(fieldValues.email) && fieldValues.email ? "" : "Please enter a valid Email";
		}
		if ("password" in fieldValues) {
			temp.password = fieldValues.password ? "" : "This field is required.";
		}
		if ("country" in fieldValues) {
			temp.country = fieldValues.country ? "" : "This field is required.";
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
			...fieldValue
		});

		validate(fieldValue);
	};

	const handleDateChange = e => {
		setSelectedDate(e);

		let birthDate = new Date(e.getFullYear(), e.getMonth(), e.getDate());
		birthDate = toServerDateTimeFormat(birthDate);

		const fieldValues = { dateOfBirth: birthDate };

		setValues({
			...values,
			...fieldValues
		});
	}

	const handleSubmit = e => {
		e.preventDefault();
		
		if (validate()) {
			const onSuccess = () => {
				addToast("User registered successfully", { appearance: "success", autoDismiss: true });
				resetForm();
			};
			
			dispatch(USER_ACTIONS.register(values, onSuccess));
			setRedirect(true);
		}
	};

	return (
		<React.Fragment>
			<Container maxWidth="sm">
				<form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<Grid container>
						<Grid item xs={12}>
							<TextField
								className={classes.textField}
								label="First Name"
								name="firstName"
								value={values.firstName}
								onChange={handleInputChange}
								{...(errors.firstName && {
									error: true,
									helperText: errors.firstName,
								})}
							/>
							<TextField
								className={classes.textField}
								label="Last Name"
								name="lastName"
								value={values.lastName}
								onChange={handleInputChange}
								{...(errors.lastName && {
									error: true,
									helperText: errors.lastName,
								})}
							/>
							<TextField
								className={classes.textField}
								label="Email"
								name="email"
								value={values.email}
								onChange={handleInputChange}
								{...(errors.email && { error: true, helperText: errors.email })}
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
								type="password"
								autoComplete="current-Password"
							/>
							<TextField
								className={classes.textField}
								label="Country"
								name="country"
								value={values.country}
								onChange={handleInputChange}
								{...(errors.country && { error: true, helperText: errors.country })}
							/>
							<Fragment>
								<MuiPickersUtilsProvider utils={DateFnsUtils}>
									<DatePicker
										className={classes.datePicker}
										disableFuture
										openTo="year"
										format="dd-MM-yyyy"
										label="Date of birth"
										views={["year", "month", "date"]}
										value={selectedDate}
										onChange={handleDateChange}
									/>
								</MuiPickersUtilsProvider>
							</Fragment>
							<Grid>
								<PrimaryButton
									variant="contained"
									className={classes.margin}
									type="submit"
								>
									Register
					  			</PrimaryButton>
								<ResetButton
									variant="contained"
									className={classes.margin}
									onClick={resetForm}
								>
									Reset
					  			</ResetButton>

								{redirect && <Redirect to="/login" />}

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

export default connect(mapStateToProps)(RegisterForm);