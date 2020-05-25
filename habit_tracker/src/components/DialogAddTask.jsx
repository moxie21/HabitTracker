import React, { useState } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	Grid,
	TextField,
	Box,
	Typography,
	Switch,
	InputAdornment,
	MenuItem,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { tasksService } from '../services/tasks.service';
import { getDayOfTheWeek, toServerDateTimeFormat } from '../helpers/dateFunctions';

const useStyles = makeStyles((theme) => ({
	root: {},
	fab: {
		backgroundColor: "#3DC1C1",
		margin: 20
	},
	textField: {
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
	text: {
		fontSize: 30,
		color: '#3DC1C1',
		textAlign: "center",
	},
	typography: {
		marginTop: theme.spacing(7),
		marginLeft: theme.spacing(1)
	},
}));

const RepeatSwitch = withStyles({
	switchBase: {
		"&$checked": {
			color: "#3DC1C1",
		},
		"&$checked + $track": {
			backgroundColor: "#3DC1C1",
		},
	},
	checked: {},
	track: {},
})(Switch);

const currentDate = new Date();
const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

const initialValues = {
	name: "",
	description: "",
	startDate: toServerDateTimeFormat(today),
	checked: true,
	repeatInterval: null,
	repeatDay: null,
	repeatMonth: null,
	repeatYear: null,
	repeatWeek: null,
	repeatWeekday: null,
};

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];
const daysOfWeek = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

export default function DialogAddTask(props) {
	const classes = useStyles();
	const [open, setOpen] = useState(false);
	const [values, setValues] = useState(initialValues);
	const [reload, setReload] = useState(false);
	// const [errors, setErrors] = useState({});
	// TODO: write logic for errors

	const validate = () => {
		// TODO: write validate function
	};

	const updateTasksCalendar = () => {
		setReload(!reload);
	}

	const resetForm = () => {
		setValues({ ...initialValues });
		// setErrors({});
	};

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		const fieldValue = { [name]: `${value}` };

		setValues({
			...values,
			...fieldValue,
		});

		validate();
	};

	const handleSwitchChange = (e) => {
		const { name, checked } = e.target;
		const switchValue = { [name]: checked };

		setValues({
			...values,
			...switchValue
		});
	}

	const handleDateChange = e => {
		let date = new Date(e.getFullYear(), e.getMonth(), e.getDate());
		date = toServerDateTimeFormat(date);
		const fieldValue = { startDate: date };

		setValues({
			...values,
			...fieldValue
		});

		validate();
	}

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(values);

		tasksService.addTask(values)
			.then(res => {
				console.log(res);
				resetForm();
				handleClose();
				updateTasksCalendar();
				//TODO make refresh
			})
	};

	return (
		<>
			<Fab
				color="primary"
				aria-label="add"
				className={classes.fab}
				onClick={handleClickOpen}
			>
				<AddIcon />
			</Fab>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Add new Task"}
				</DialogTitle>
				<form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<Grid container>
								<Grid container xs={5}>
									<Grid item xs={12}>
										<TextField
											className={classes.textField}
											label="Task Name"
											name="name"
											value={values.name}
											onChange={handleInputChange}
										/>
									</Grid>
									<Grid item xs={12}>
										<TextField
											className={classes.textField}
											label="Short Description"
											name="description"
											value={values.description}
											onChange={handleInputChange}
										/>
									</Grid>
									<Typography component="div" className={classes.typography}>
										<Grid component="label" container alignItems="center" spacing={1}>
											<Grid item>Repeat every: </Grid>
											<Grid item>
												<RepeatSwitch
													checked={values.checked}
													onChange={handleSwitchChange}
													name="checked"
												/>
											</Grid>
										</Grid>
									</Typography>
								</Grid>

								<Grid item xs={7}>
									<MuiPickersUtilsProvider utils={DateFnsUtils}>
										<DatePicker
											autoOk
											disableToolbar
											name="startDate"
											variant="static"
											openTo="date"
											value={values.startDate}
											onChange={handleDateChange}
										/>
									</MuiPickersUtilsProvider>
								</Grid>

								<Grid item xs={12}>

									{values.checked ? (
										<>
											<TextField
												name="repeatInterval"
												value={values.repeatInterval}
												className={classes.textField}
												onChange={handleInputChange}
												type="number"
												InputProps={{
													inputProps: { min: 1 },
													startAdornment: (
														<InputAdornment position="start">
															Number of Days:{" "}
														</InputAdornment>
													),
												}}
											/>
											<br />
											<br />
											<br />
											<br />
											<br />
											<br />
											<br />
										</>
									) : (
											<Grid container spacing={3}>
												<Grid item xs={6}>
													<TextField
														name="repeatWeekday"
														select
														value={values.repeatWeekday}
														className={
															classes.textField
														}
														onChange={handleInputChange}
														InputProps={{
															startAdornment: (
																<InputAdornment position="start">
																	Day of the Week:{" "}
																</InputAdornment>
															),
														}}
													>
														{daysOfWeek.map(
															(option, index) => (
																<MenuItem
																	key={index}
																	value={index}
																>
																	{option}
																</MenuItem>
															)
														)}
													</TextField>
													<TextField
														name="repeatDay"
														value={values.repeatDay}
														className={
															classes.textField
														}
														onChange={handleInputChange}
														type="number"
														InputProps={{
															inputProps: {
																min: 1,
																max: 31,
															},
															startAdornment: (
																<InputAdornment position="start">
																	Day of the
                                                                Month:{" "}
																</InputAdornment>
															),
														}}
													/>
													<TextField
														name="repeatWeek"
														value={values.repeatWeek}
														className={
															classes.textField
														}
														onChange={handleInputChange}
														type="number"
														InputProps={{
															inputProps: {
																min: 1,
																max: 6,
															},
															startAdornment: (
																<InputAdornment position="start">
																	Week of the
                                                                Month:{" "}
																</InputAdornment>
															),
														}}
													/>
												</Grid>
												<Grid item xs={6}>
													<TextField
														name="repeatMonth"
														select
														value={values.repeatMonth}
														className={
															classes.textField
														}
														onChange={handleInputChange}
														InputProps={{
															startAdornment: (
																<InputAdornment position="start">
																	Month:{" "}
																</InputAdornment>
															),
														}}
													>
														{months.map(
															(option, index) => (
																<MenuItem
																	key={index}
																	value={index + 1}
																>
																	{option}
																</MenuItem>
															)
														)}
													</TextField>
													<TextField
														name="repeatYear"
														value={values.repeatYear}
														className={
															classes.textField
														}
														onChange={handleInputChange}
														type="number"
														InputProps={{
															inputProps: {
																min: 2020,
															},
															startAdornment: (
																<InputAdornment position="start">
																	Year:{" "}
																</InputAdornment>
															),
														}}
													/>
												</Grid>
											</Grid>
										)}
								</Grid>
							</Grid>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							CANCEL
                        </Button>
						<Button type="submit" color="primary" autoFocus>
							SAVE
                        </Button>
					</DialogActions>
				</form>
			</Dialog>
			<Box component="div" display="inline" className={classes.text}>
				New Task
            </Box>
		</>
	);
}
