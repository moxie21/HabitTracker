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
	MenuItem
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import { tasksService } from '../services/tasks.service';

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
		marginBottom: theme.spacing(5),
		marginLeft: theme.spacing(1)
	},
}));

const RepeatSwitch = withStyles({
	switchBase: {
		'&$checked': {
			color: '#3DC1C1',
		},
		'&$checked + $track': {
			backgroundColor: '#3DC1C1',
		},
	},
	checked: {},
	track: {},
})(Switch);

const today = new Date();

const months = [
	{	//cred ca incepeau de la 0 da' mna
		value: 1,
		label: 'January'
	},
	{
		value: 2,
		label: 'February',
	},
	{
		value: 3,
		label: 'March',
	},
	{
		value: 4,
		label: 'April',
	},
	{
		value: 5,
		label: 'May',
	},
	{
		value: 6,
		label: 'June',
	},
	{
		value: 7,
		label: 'July',
	},
	{
		value: 8,
		label: 'August',
	},
	{
		value: 9,
		label: 'September',
	},
	{
		value: 10,
		label: 'October',
	},
	{
		value: 11,
		label: 'November',
	},
	{
		value: 12,
		label: 'December',
	},
];
const daysOfWeek = [
	{
		value: 1,
		label: 'Monday'
	},
	{
		value: 2,
		label: 'Tuesday',
	},
	{
		value: 3,
		label: 'Wednesday',
	},
	{
		value: 4,
		label: 'Thursday',
	},
	{
		value: 5,
		label: 'Friday',
	},
	{
		value: 6,
		label: 'Saturday',
	},
	{
		value: 0,	//cred?
		label: 'Sunday',
	},
];
export default function DialogAddTask(props) {
	const classes = useStyles();
	const [editTaskModalOpen, setTaskModalOpen] = useState(false);
	const [editValues, setEditValues] = useState(initialEditDialogValues);
    const { name, description, color} = props;	
    
	// const [errors, setErrors] = useState({});
	// TODO: write logic for errors

	const dialogValidate = () => {
		// TODO: write validate function
	}

	const dialogResetForm = () => {
		setEditValues({ ...initialEditDialogValues });
		// setErrors({});
	};

	const dialogHandleClickOpen = () => {
		setTaskModalOpen(true);
	};

	const dialogHandleClose = () => {
		setTaskModalOpen(false);
	};

	const dialogHandleInputChange = e => {
		const { name, value } = e.target;
		const fieldValue = { [name]: value };

		setEditValues({
			...editValues,
			...fieldValue
		});

		dialogValidate();
	};

	const dialogHandleSwitchChange = e => {
		const { name, checked } = e.target;
		const switchValue = { [name]: checked };

		setEditValues({
			...editValues,
			...switchValue
		});
	};

	const dialogHandleSubmit = e => {
		e.preventDefault();
		//UPDATE
		dialogResetForm();
	}

	const dialogDeleteTask = e => {
		e.preventDefault();
		//DELETE
	}

	return (
		<>
			<Fab
				color="primary"
				aria-label="add"
				className={classes.fab}
				onClick={dialogHandleClickOpen}
			>
				<AddIcon />
			</Fab>
			<Dialog
				open={editTaskModalOpen}
				onClose={dialogHandleClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Add new Task"}
				</DialogTitle>
				<form autoComplete="off" noValidate onSubmit={dialogHandleSubmit}>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<Grid container>
								<Grid item xs={12}>
									<TextField
										className={classes.textField}
										label="Task Name"
										name="name"
										value={editValues.name}
										onChange={dialogHandleInputChange}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										className={classes.textField}
										label="Short Description"
										name="description"
										value={editValues.description}
										onChange={dialogHandleInputChange}
									/>
								</Grid>

								<Grid item xs={12}>
									<Typography component="div" className={classes.typography}>
										<Grid component="label" container alignItems="center" spacing={1}>
											<Grid item>Repeat every: </Grid>
											<Grid item>
												<RepeatSwitch
													checked={editValues.checked}
													onChange={dialogHandleSwitchChange}
													name="checked"
												/>
											</Grid>
										</Grid>
									</Typography>

									{editValues.checked ?
										<>
											<TextField
												name="repeatInterval"
												value={editValues.repeatInterval}
												className={classes.textField}
												onChange={dialogHandleInputChange}
												type="number"
												InputProps={{
													inputProps: { min: 1 },
													startAdornment: <InputAdornment position="start">Number of Days: </InputAdornment>,
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
                                    : <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField
                                                name="repeatWeekday"
                                                select
                                                value={editValues.repeatWeekday}
                                                className={classes.textField}
                                                onChange={dialogHandleInputChange}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">Day of the Week: </InputAdornment>,
                                                }}
                                            >
                                                {daysOfWeek.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                name="repeatDay"
                                                value={editValues.repeatDay}
                                                className={classes.textField}
                                                onChange={dialogHandleInputChange}
                                                type="number"
                                                InputProps={{
                                                inputProps: { min: 1, max: 31 },
                                                    startAdornment: <InputAdornment position="start">Day of the Month: </InputAdornment>,
                                                }}
                                            />
                                            <TextField
                                                name="repeatWeek"
                                                value={editValues.repeatWeek}
                                                className={classes.textField}
                                                onChange={dialogHandleInputChange}
                                                type="number"
                                                InputProps={{
                                                inputProps: { min: 1, max :6 },
                                                    startAdornment: <InputAdornment position="start">Week of the Month: </InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                name="repeatMonth"
                                                select
                                                value={editValues.repeatMonth}
                                                className={classes.textField}
                                                onChange={dialogHandleInputChange}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">Month: </InputAdornment>,
                                                }}
                                            >
                                                {months.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                name="repeatYear"
                                                value={editValues.repeatYear}
                                                className={classes.textField}
                                                onChange={dialogHandleInputChange}
                                                type="number"
                                                InputProps={{
                                                inputProps: { min: 2020 },
                                                    startAdornment: <InputAdornment position="start">Year: </InputAdornment>,
                                                }}
                                            />
                                        </Grid>
                                    </Grid>}
								</Grid>
							</Grid>
						</DialogContentText>
					</DialogContent>
					<DialogActions>
                        <Button onClick={dialogDeleteTask} style={{marginRight: 'auto'}}>
                            <DeleteIcon color="secondary" fontSize="large"/>
                            <Typography color="secondary">DELETE</Typography>
                        </Button>
						<Button onClick={dialogHandleClose} color="primary">
							CANCEL
						</Button>
						<Button type="submit" color="primary" autoFocus>
							SAVE
						</Button>
					</DialogActions>
				</form>
			</Dialog>
		</>
	);
}
