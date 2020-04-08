import React, { useState, useEffect } from "react";
import { Grid, Box } from "@material-ui/core";
import TestComponent from "./TestComp";
import {makeStyles} from "@material-ui/styles";

const useStyles = makeStyles({
    box: {
        width: 60,
        height: 60,
        display: 'table-cell'
    },
    gridBorderRounded: {
        width: '45%',
        marginLeft: 200,
        marginBottom: 10,
        borderRadius: 50,
        padding: 5,
        fontSize: 15,
        border: '1px solid #e4dcdc'
    },
    gridBorder: {
        width: 200,
        // height: 60,
        display: 'table-cell',
        fontSize: 20,
        color: '#778181',
        border: '1px solid #e4dcdc'
    }
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Test() {
    const classes = useStyles();
    const [dates, setDates] = useState([]);
    const [tasks, setTasks] = useState([]);
    const currentDate = new Date();
    const todayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    const toTimestamp = date => {
        let auxDate = new Date(date);
        return auxDate.getTime();
    };
     const getDatesFromInterval = (startDate, endDate) => {
        let dates = [];
        let tempDate = startDate;

        const addDays = (date, days) => {
            let auxDate = new Date(date);
            auxDate.setDate(auxDate.getDate() + days);
            return auxDate;
        };

        while (tempDate <= endDate) {
            dates.push(tempDate);
            tempDate = addDays(tempDate, 1);
        }
        return dates;
    };

    useEffect(() => {
        let datesArr = [];
        // let currentDate = new Date();
        let firstDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 13);
        let lastDate = new Date(todayDate);
        
        datesArr = getDatesFromInterval(firstDate, lastDate);
        setDates(datesArr);

        const startDateTimestamp = toTimestamp(firstDate);
        const endDateTimestamp = toTimestamp(lastDate);

        const API_PATH = `http://localhost:3300/events/${startDateTimestamp}/${endDateTimestamp}`;
        const fetchData = async () => {
            await fetch(API_PATH)
                .then(res => res.json())
                .then(
                    result => {
                        const { data } = result;
                        let lastName = "";
                        let tasks = [];
                        let index = -1;

                        data.forEach((singleTask, key) => {
                            if (singleTask.Name !== lastName) {
                                tasks[++index] = {
                                    Name: singleTask.Name,
                                    Description: singleTask.Description,
                                    Dates: [
                                        {
                                            Date: new Date(singleTask.Date),
                                            Status: singleTask.Status
                                        }
                                    ]
                                }
                            }
                            else {
                                tasks[index].Dates.push({
                                    Date: new Date(singleTask.Date),
                                    Status: singleTask.Status
                                });
                            }

                            lastName = singleTask.Name;
                        });

                        console.log(tasks);

                        setTasks(tasks);
                    },
                    error => {
                        throw error;
                    }
                )
        };
        fetchData().catch(err => console.log(err));
    }, []);

    return (
        <div>
            <h1>Hello</h1>
            <br/><br/>

            <Grid className={classes.gridBorderRounded}>
                {dates.map((date, key) => 
                    <Box className={classes.box}>
                        {months[date.getMonth()]}
                        <br />
                        {date.getDate()}
                        <br />
                        {daysOfWeek[date.getDayOfTheWeek()]}
                    </Box>)}
            </Grid>

            
            {tasks.map((task, key) => {
                let i = 0;
                return (
                    <Grid>
                        <Box className={classes.gridBorder}>{task.Name}</Box>

                        {dates.map((date, key) => {
                            let activity = task.Dates[i];

                            if (activity.Date.getTime() === date.getTime()) {
                                if (i < task.Dates.length - 1) {
                                    i++;
                                }
                                return <TestComponent status={activity.Status} taskDate={activity.Date} />
                            } else {
                                return <Box className={classes.box}/>;
                            }
                        })}
                    </Grid>
                );
            })}
        </div>
    );
}
