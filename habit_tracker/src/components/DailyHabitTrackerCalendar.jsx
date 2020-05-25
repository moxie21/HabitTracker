import * as React from 'react';
import { useState, useEffect } from 'react';
import { getDayOfTheWeek, toServerDateTimeFormat } from '../helpers/dateFunctions';
import { makeStyles } from '@material-ui/core/styles';
import ColorBox from './ColorBox';
import { 
    Box,
    Paper,
    Grid,
    Container,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography
} from '@material-ui/core';
import { useToasts } from "react-toast-notifications";
import DialogAddHabit from './DialogAddHabit';
import { habitService } from '../services/habits.service';
import ColorPicker from "material-ui-color-picker";
import arrowLeft from '../assets/icons/arrowLeft.png';
import arrowRight from '../assets/icons/arrowRight.png';
import DeleteIcon from "@material-ui/icons/DeleteForever";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        paddingTop: 30
    },
    habitTitleBox: {
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
    fab: {
        backgroundColor: '#3DC1C1'
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
    dialogTextField: {
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
}));

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const incrementDate = (date, days) => {
    let auxDate = new Date(date);
    auxDate.setDate(auxDate.getDate() + days);
    return auxDate;
};

const hexToRgb = (hex, alfa) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    
    let r = parseInt(result[1], 16);
    let g = parseInt(result[2], 16);
    let b = parseInt(result[3], 16);

    return result ? "rgb(" + r + ", " + g + ", " + b + ", " + alfa +  ")" : null;
};

const currentDate = new Date();
const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
const startDate = new Date(endDate);
startDate.setDate(startDate.getDate() - 14);
const firstApiParam = toServerDateTimeFormat(startDate);
const secondApiParam = toServerDateTimeFormat(endDate);

const initialDatesApiParams = {
    startDate: firstApiParam,
    endDate: secondApiParam
}

const initialEditDialogValues = {
    id: '',
    name: '',
    description: '',
    color: ''
}

export default function DailyHabitTrackerCalendar() {
    const classes = useStyles();
    const [values, setValues] = useState({});
    const [datesApiParams, setDatesApiParams] = useState(initialDatesApiParams);
    const [dates, setDates] = useState([]);
    const [reload, setReload] = useState(false);
    const [editHabitModalOpen, setEditHabitModalOpen] = useState(false);
    const [editValues, setEditValues] = useState(initialEditDialogValues);
    const { addToast } = useToasts();
    let gridKey = 0;
    let colorBoxIndex = 0;
    let boxActivityNameIndex = 0;
    const currentDate = new Date();
    const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    useEffect(() => {
        let auxDatesArray = [];

        const allRequests = async () => {
            return Promise.all([habitService.getHabits(), habitService.getHabitsHistory(datesApiParams.startDate, datesApiParams.endDate)])
                .then(response => {
                    const habits = response[0];
                    const history = response[1];

                    let stateValues = {};
                    let historyIndex = 0;
                    let okToAddDates = true;

                    const getActivityList = id => {
                        let tempDate = new Date(datesApiParams.startDate);
                        let activityList = [];
                        let auxObj = {};
                        const endDateToCompare = new Date(datesApiParams.endDate).getTime();

                        while (tempDate.getTime() <= endDateToCompare) {
                            const historyRow = history ? history[historyIndex] : null;

                            if (historyRow && historyRow.date === toServerDateTimeFormat(tempDate) && historyRow.habitId === id) {
                                auxObj = {
                                    id: historyRow.id,
                                    date: historyRow.date,
                                    status: historyRow.status,
                                    opacity: historyRow.opacity
                                }
                                if (historyIndex < history.length - 1) {
                                    historyIndex++;
                                }
                            }
                            else {
                                auxObj = {
                                    id: null,
                                    date: toServerDateTimeFormat(tempDate),
                                    status: 0,
                                    opacity: 0
                                }
                            }

                            okToAddDates && auxDatesArray.push(tempDate);
                            activityList.push(auxObj);
                            tempDate = incrementDate(tempDate, 1);
                        }
                        
                        okToAddDates = false;
                        return activityList;
                    };

                    habits.forEach(habit => {
                        const { id, color, description } = habit;

                        stateValues = {
                            ...stateValues,
                            [habit.name]: {
                                id,
                                color,
                                description,
                                activityList: getActivityList(habit.id)
                            }
                        }
                    });

                    setValues(stateValues);
                    setDates(auxDatesArray);
                })
                .catch(err => console.log(err))
        }

        allRequests();
    }, [reload, datesApiParams, editHabitModalOpen]);

    const updateCalendar = () => {
        setReload(!reload);
    };

    const updateDataOnClick = (habit, isSkip) => {
        // *@param habit: {id, name, date, status, habitId}
        const markDone = habit => {
            habitService.addHabitHistory(habit.habitId, habit.date, 1)
                .then(res => {
                    updateCalendar();
                    addToast("Congratulations 👍", { appearance: "success", autoDismiss: true });
                })
        }
        const markUndone = habit => {
            habitService.deleteHabitHistory(habit.id)
                .then(res => { 
                    updateCalendar();
                    addToast("Maybe next time 😅", { appearance: "error", autoDismiss: true });
                })
        }   
        const markSkip = habit => {
            const { id, habitId, date, status } = habit;

            console.log({ id, habitId, date, status})

            if (id !== null) {
                habitService.updateHabitHistory(habit.id, { id, habitId, date, status: 2 })
                    .then(res => {
                        updateCalendar();
                        addToast("Maybe next time 😅", { appearance: "error", autoDismiss: true });
                    })
            }
            else {
                habitService.addHabitHistory(habit.habitId, habit.date, 2)
                    .then(res => {
                        updateCalendar();
                        addToast("Congratulations 👍", { appearance: "success", autoDismiss: true });
                    })
            }
        }

        // markDone(habit);
        // markUndone(habit);
        // markSkip(habit);

        if (isSkip) {
            // check if skip is possible else send info toast
            markSkip(habit);
        }
        else {
            if (habit.id === null) {
                markDone(habit);
            }
            else {
                markUndone(habit);
            }
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

            setDatesApiParams({
                startDate: toServerDateTimeFormat(startDate),
                endDate: toServerDateTimeFormat(endDate)
            });
        }
        else {
            endDate = dateFormatEndDate.setDate(dateFormatEndDate.getDate() + 7);
            startDate = dateFormatStartDate.setDate(dateFormatStartDate.getDate() + 7);
            
            if (new Date(endDate).getTime() <= new Date().getTime()) {
                setDatesApiParams({
                    startDate: toServerDateTimeFormat(startDate),
                    endDate: toServerDateTimeFormat(endDate)
                });
            }
        }
    }

    const openEditHabitDialog = (id, name, description, color) => {
        setEditValues({id, name, description, color});
        setEditHabitModalOpen(true);
    }

    const dialogResetForm = () => {
        setValues({ ...initialEditDialogValues });
        // setErrors({});
    };

    const dialogHandleClickOpen = () => {
        setEditHabitModalOpen(true);
    };

    const dialogHandleClose = () => {
        setEditHabitModalOpen(false);
    };

    const dialogHandleInputChange = (e) => {
        const { name, value } = e.target;
        const fieldValue = { [name]: value };

        setEditValues({
            ...editValues,
            ...fieldValue,
        });
    };

    const dialogHandleSubmit = (e) => {
        e.preventDefault();

        console.log(editValues);
        
        habitService.updateHabit(editValues)
            .then(res => {
                console.log(res);
                dialogHandleClose();
                updateCalendar();
            })
            .catch(err => console.log(err))
    };

    const dialogDeleteHabit = (e) => {
        e.preventDefault();

        habitService.deleteHabit(editValues.id)
            .then(res => {
                dialogHandleClose();
                updateCalendar();
            })
            .catch(err => console.log(err))
    };

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
                        {dates.reduce((result, date, key) => {
                            if (key > 0) {
                                result.push(
                                    <Box className={classes.box} style={date.getTime() === todayDate.getTime() ? {color: '#D6225B'}: {}}>
                                        {months[date.getMonth()]}
                                        <br />
                                        {date.getDate()}
                                        <br />
                                        {daysOfWeek[getDayOfTheWeek(date)]}
                                    </Box>
                                );
                            }

                            return result;
                        }, [])}
                    </Grid>
                    <Grid item>
                        <Box onClick={() => handleDateChange('right')} className={classes.arrowBox}>
                            <img src={arrowRight} alt="Right Arrow"/>
                        </Box>
                    </Grid>
                </Grid>

                {Object.keys(values).map(habit => {
                    return (
                        <Grid key={gridKey++}>
                            <Box onClick={() => {openEditHabitDialog(values[habit].id, habit, values[habit].description, values[habit].color)}} className={classes.habitTitleBox} key={boxActivityNameIndex++}>
                                {habit}
                            </Box>
    
                            {Object.keys(values[habit].activityList).map((key) => {
                                // status: 1 - full, 2 - half, 0 - empty
    
                                const activity = values[habit].activityList[key];
                                const newColor = hexToRgb(values[habit].color, activity.opacity);
                                
                                return key > 0 ? <ColorBox updateData={updateDataOnClick} key={colorBoxIndex++} id={activity.id} name={habit} color={newColor} status={activity.status} date={activity.date} habitId={values[habit].id} /> : null;
                            }, values[habit].activityList)}
                        </Grid>
                    )
                }, values)}
                <DialogAddHabit updateParent={updateCalendar} />
            </Paper>

            <Dialog
                open={editHabitModalOpen}
                onClose={dialogHandleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Edit Habit"}
                </DialogTitle>
                <form autoComplete="off" noValidate onSubmit={dialogHandleSubmit}>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        className={classes.dialogTextField}
                                        label="Habit Name"
                                        name="name"
                                        value={editValues.name}
                                        onChange={dialogHandleInputChange}
                                        // {...(errors.firstName && {
                                        //     error: true,
                                        //     helperText: errors.firstName,
                                        // })}
                                    />
                                    <TextField
                                        className={classes.dialogTextField}
                                        label="Short Description"
                                        name="description"
                                        value={editValues.description}
                                        onChange={dialogHandleInputChange}
                                        // {...(errors.firstName && {
                                        //     error: true,
                                        //     helperText: errors.firstName,
                                        // })}
                                    />
                                    <ColorPicker
                                        name="color"
                                        defaultValue={"Habit Color"}
                                        value={editValues.color}
                                        onChange={(color) =>
                                            setEditValues({ ...editValues, color })
                                        }
                                    />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                    <br />
                                </Grid>
                            </Grid>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={dialogDeleteHabit}
                            style={{ marginRight: "auto" }}
                        >
                            <DeleteIcon color="secondary" fontSize="large" />
                            <Typography color="secondary">DELETE</Typography>
                        </Button>
                        <Button onClick={dialogHandleClose} color="primary">
                            CANCEL
                        </Button>
                        <Button type="submit" color="primary" autoFocus>
                            UPDATE
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Container>
    );
}