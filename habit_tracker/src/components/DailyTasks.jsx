import React, { useState, useEffect } from "react";
import { getDayOfTheWeek, toServerDateTimeFormat } from '../helpers/dateFunctions';
import {
    Container,
    Paper,
    Grid,
    Box,
    Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Fab,
	TextField,
	Typography,
	Switch,
	InputAdornment,
	MenuItem
} from "@material-ui/core";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles, withStyles} from "@material-ui/styles";
import TaskBox from "./TaskBox";
import NavbarLogged from "./NavbarLogged";
import DialogAddTask from './DialogAddTask';
import { tasksService } from "../services/tasks.service";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from '@material-ui/icons/DeleteForever';
import headerLinksStyle from "../assets/styles/headerLinksStyle";
import arrowLeft from '../assets/icons/arrowLeft.png';
import arrowRight from '../assets/icons/arrowRight.png';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        paddingTop: 30
    },
    dialogTextField: {
        // marginBottom: theme.spacing(5),
        marginBottom: 40,
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
	dialogText: {
		fontSize: 30,
		color: '#3DC1C1',
		textAlign: "center",
	},
	dialogTypography: {
		// marginBottom: theme.spacing(5),
        // marginLeft: theme.spacing(1)
        marginBottom: 40,
		marginLeft: 8
	},
    box: {
        width: 60,
        height: 60,
        display: 'table-cell'
    },
    arrowBox: {
        height: 60,
        display: 'table-cell',
        paddingTop: '28px',
        paddingLeft: '5px',
        paddingRight: '5px',
        width: '12px',
    },
    datesGrid: {
        marginLeft: '150px',
        paddingTop: '28px',
        paddingLeft: '5px',
        paddingRight: '5px',
        width: '12px'
    },
    gridBorderRounded: {
        width: '70%',
        textAlign: 'center',
        lineHeight: '100%',
        marginLeft: 0,
        marginBottom: 10,
        borderRadius: 50,
        paddingTop: 15,
        paddingLeft: 10,
        fontSize: 15,
        border: '1px solid #e4dcdc'
    },
    gridBorder: {
        width: 200,
        display: 'table-cell',
        fontSize: 20,
        color: '#778181',
        border: '1px solid #e4dcdc'
    },
    taskTitleBox: {
        width: 150,
        height: 60,
        display: 'table-cell',
        fontSize: 20,
        color: '#778181',
        paddingLeft: 20,
        paddingRight: 10,
        border: '1px solid #e4dcdc',
        textAlign: 'center'
    },
}));

const currentDate = new Date();
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
const startDate = new Date(endDate);
endDate.setDate(endDate.getDate() + 6);
startDate.setDate(startDate.getDate() - 7);
const firstApiParam = toServerDateTimeFormat(startDate);
const secondApiParam = toServerDateTimeFormat(endDate);
const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

const initialDatesApiParams = {
    startDate: firstApiParam,
    endDate: secondApiParam
}

const initialEditDialogValues = {
    id: '',
    name: '',
    description: '',
    checked: true,
    meta: {
        startDate: toServerDateTimeFormat(today),
        checked: true,
        repeatInterval: null,
        repeatDay: null,
        repeatMonyh: null,
        repeatYear: null,
        repeatWeek: null,
        repeatWeekday: null
    }
};

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysOfWeekDropDown = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

export default function DailyTasks() {
    const classes = useStyles();
    const [dates, setDates] = useState([]);
    const [datesApiParams, setDatesApiParams] = useState(initialDatesApiParams);
    const [tasks, setTasks] = useState([]);
    const [reload, setReload] = useState(false);
    const [editTaskModalOpen, setTaskModalOpen] = useState(false);
	const [editValues, setEditValues] = useState(initialEditDialogValues);
    const currentDate = new Date();
    const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());


    const getDatesFromInterval = (startDate, endDate) => {
        let dates = [];
        let tempDate = startDate;
        
        const addDays = (date, days) => {
            let auxDate = new Date(date);
            auxDate.setDate(auxDate.getDate() + days);
            return auxDate;
        };

        while(tempDate <= endDate) {
            dates.push(tempDate);
            tempDate = addDays(tempDate, 1);
        }
        return dates;
    };

    useEffect(() => {
        let datesArray = [];
        let firstDate = new Date(datesApiParams.startDate);
        let lastDate = new Date(datesApiParams.endDate);

        datesArray = getDatesFromInterval(firstDate, lastDate);

        setDates(datesArray);

        const fetchData = async () => {
            await tasksService.getTasksHistory(datesApiParams.startDate, datesApiParams.endDate)
                .then(
                    result => {
                        let lastId = "";
                        let tasks = [];
                        let index = -1;

                        console.log(result)

                        result.forEach(singleTask => {
                            if (singleTask.id !== lastId) {
                                tasks[++index] = {
                                    id: singleTask.id,
                                    name: singleTask.name,
                                    description: singleTask.description,
                                    meta: {
                                        metaId: singleTask.metaId,
                                        repeatInterval: singleTask.repeatInterval,
                                        repeatDay: singleTask.repeatDay,
                                        repeatMonth: singleTask.repeatMonth,
                                        repeatWeek: singleTask.repeatWeek,
                                        repeatWeekday: singleTask.repeatWeekday,
                                        repeatYear: singleTask.repeatYear,
                                        startDate: singleTask.startDate,
                                    },
                                    dates: [
                                        {
                                            date: new Date(singleTask.date),
                                            status: singleTask.status,
                                            historyId: singleTask.historyId
                                        }
                                    ]
                                }
                            }
                            else {
                                tasks[index].dates.push({
                                    date: new Date(singleTask.date),
                                    status: singleTask.status,
                                    historyId: singleTask.historyId
                                });
                            }
                            lastId = singleTask.id;
                        });
                        setTasks(tasks);
                    },
                    error => {
                        throw error;
                    }
                ) 
        };
        fetchData().catch(err => console.log(err));
    }, [reload, datesApiParams]);

    const updateCalendar = () => {
        setReload(!reload);
    };

    const updateDataOnClick = async (taskId, historyId, status, date) => {
        if (status) {
            tasksService.deleteTaskHistory(historyId)
                .then(updateCalendar())
                .catch(err => console.log(err))
        }
        else {
            tasksService.addTasksHistory(toServerDateTimeFormat(date), taskId)
                .then(updateCalendar())
                .catch(err => console.log(err))
        }
    }

    const handleDateChange = direction => {
        const dateFormatStartDate = new Date(datesApiParams.startDate);
        const dateFormatEndDate = new Date(datesApiParams.endDate);
        let startDate;
        let endDate;

        if (direction === 'left') {
            endDate = dateFormatEndDate.setDate(dateFormatEndDate.getDate() - 7);
            startDate = dateFormatStartDate.setDate(dateFormatStartDate.getDate() - 7);
        }
        else {
            endDate = dateFormatEndDate.setDate(dateFormatEndDate.getDate() + 7);
            startDate = dateFormatStartDate.setDate(dateFormatStartDate.getDate() + 7);
        }

        setDatesApiParams({
            startDate: toServerDateTimeFormat(startDate),
            endDate: toServerDateTimeFormat(endDate)
        });
    }

    const openEditTaskDialog = (id, name, description, meta) => {
        setEditValues({
            id, name, description, meta,
            checked: !(meta.repeatInterval === null)
        });
        setTaskModalOpen(true);
    }

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

    const dialogHandleDateChange = e => {
		let date = new Date(e.getFullYear(), e.getMonth(), e.getDate());
		date = toServerDateTimeFormat(date);
		const fieldValue = { startDate: date };

		setEditValues({
			...editValues,
			...fieldValue
		});
    }
    
	const dialogHandleSubmit = e => {
		e.preventDefault();
		console.log(editValues)
        // dialogResetForm();
        // dialogHandleClose();
	}

	const dialogDeleteTask = e => {
		e.preventDefault();

        tasksService.deleteTask(editValues.id)
            .then(res => {
                dialogHandleClose();
                updateCalendar();
            })
            .catch(err => console.log(err))
	}
    
    return (
        <Container>
            <Paper elevation={10} className={classes.root}>
                <Grid container>
                    <Grid item>
                        <Box onClick={() => handleDateChange('left')} className={classes.datesGrid}>
                            <img src={arrowLeft} alt="Left Arrow"/>
                        </Box>
                    </Grid>
                    <Grid item className={classes.gridBorderRounded}>
                        {dates.map((date, key) => 
                            // <Box className={classes.box} >
                            <Box className={classes.box} style={date.getTime() === todayDate.getTime() ? {color: '#D6225B'}: {}}>
                                {months[date.getMonth()]}
                                <br />
                                {date.getDate()}
                                <br />
                                {daysOfWeek[getDayOfTheWeek(date)]}
                            </Box>)}
                    </Grid>
                    <Grid item>
                        <Box onClick={() => handleDateChange('right')} className={classes.arrowBox}>
                            <img src={arrowRight} alt="Right Arrow"/>
                        </Box>
                    </Grid>
                </Grid>
                
                {tasks.map((task) => {
                    let i = 0;
                    return (
                        <Grid>
                            <Box onClick={() => openEditTaskDialog(task.id, task.name, task.description, task.meta)} className={classes.taskTitleBox}>
                                {task.name}
                                {console.log(tasks)}
                            </Box>

                            {dates.map(date => {
                                let activity = task.dates[i];

                                if (activity.date.getTime() === date.getTime()) {
                                    if (i < task.dates.length - 1) {
                                        i++;
                                    }
                                    return <TaskBox updateData={updateDataOnClick} taskId={task.id} historyId={activity.historyId} status={activity.status} taskDate={activity.date} />
                                } else {
                                    return <Box className={classes.box}/>;
                                }
                            })}
                        </Grid>
                    );
                })}
                <DialogAddTask updateParent={updateCalendar} />
                
                <Dialog
                    open={editTaskModalOpen}
                    onClose={dialogHandleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Edit Task"}
                    </DialogTitle>
                    <form autoComplete="off" noValidate onSubmit={dialogHandleSubmit}>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                <Grid container>
                                    <Grid container xs={5}>
                                        <Grid item xs={12}>
                                            <TextField
                                                disabled
                                                className={classes.dialogTextField}
                                                label="Task Name"
                                                name="name"
                                                value={editValues.name}
                                                onChange={dialogHandleInputChange}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                disabled
                                                className={classes.dialogTextField}
                                                label="Short Description"
                                                name="description"
                                                value={editValues.description}
                                                onChange={dialogHandleInputChange}
                                            />
                                        </Grid>
                                        <Typography component="div" className={classes.dialogTypography}>
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
                                    </Grid>
                                    <Grid item xs={7}>
                                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                            <DatePicker
                                                disabled
                                                autoOk
                                                disableToolbar
                                                name="startDate"
                                                variant="static"
                                                openTo="date"
                                                value={editValues.meta.startDate}
                                                onChange={dialogHandleDateChange}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Grid>

                                    {editValues.checked ?
                                        <>
                                        {console.log(editValues.meta)}
                                            <TextField
                                                disabled
                                                name="repeatInterval"
                                                value={editValues.meta.repeatInterval}
                                                className={classes.dialogTextField}
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
                                                disabled
                                                name="repeatWeekday"
                                                select
                                                value={editValues.meta.repeatWeekday === '*' ? null : editValues.meta.repeatWeekday}
                                                className={classes.dialogTextField}
                                                onChange={dialogHandleInputChange}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">Day of the Week: </InputAdornment>,
                                                }}
                                            >
                                               {daysOfWeekDropDown.map(
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
                                                disabled
                                                name="repeatDay"
                                                value={editValues.meta.repeatDay === '*' ? null : editValues.meta.repeatDay}
                                                className={classes.dialogTextField}
                                                onChange={dialogHandleInputChange}
                                                type="number"
                                                InputProps={{
                                                inputProps: { min: 1, max: 31 },
                                                    startAdornment: <InputAdornment position="start">Day of the Month: </InputAdornment>,
                                                }}
                                            />
                                            <TextField
                                                disabled
                                                name="repeatWeek"
                                                value={editValues.meta.repeatWeek === '*' ? null : editValues.meta.repeatWeek}
                                                className={classes.dialogTextField}
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
                                                disabled
                                                name="repeatMonth"
                                                select
                                                value={editValues.meta.repeatMonth === '*' ? null : editValues.meta.repeatMonth}
                                                className={classes.dialogTextField}
                                                onChange={dialogHandleInputChange}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">Month: </InputAdornment>,
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
                                                disabled
                                                name="repeatYear"
                                                value={editValues.meta.repeatYear === '*' ? null : editValues.meta.repeatYear}
                                                className={classes.dialogTextField}
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
            </Paper>
        </Container>
    );
}
