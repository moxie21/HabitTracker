import React, {useState, useEffect} from "react";
import {Grid, Box} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import TasksGreenIcon from '../assets/icons/TasksGreen.png';
import TasksRedIcon from '../assets/icons/TasksRed.png';
import TasksGreyIcon from '../assets/icons/TasksGrey.png';

const useStyles = makeStyles({
    root: {
        width: 60,
        height: 60,
        display: 'table-cell'
    }
});

export default function TaskBox(props) {
    const classes = useStyles();
    const [status, setStatus] = useState(props.status);
    const { taskDate, taskId, historyId, updateData } = props;
    const actualDate = new Date();
    const todayDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate());

    let img;

    if (taskDate.getTime() < todayDate.getTime()) {         // in the past
        if (status === 1) {
            img = TasksGreenIcon;
        }
        else if (status === 0) {
            img = TasksRedIcon;
        }
    }
    else if (taskDate.getTime() == todayDate.getTime()) {   // today
        if (status === 1) {
            img = TasksGreenIcon;
        }
        else if (status === 0) {
            img = TasksGreyIcon;
        }
    }
    else {                                                  // in the future
        // disabled
        img = TasksGreyIcon;
    }

    const changeStateClick = () => status === 0 ? setStatus(1) : setStatus(0);

    return (
        <Box className={classes.root} onClick={() => {
            if (taskDate.getTime() <= todayDate.getTime()) {
                changeStateClick();
                updateData(taskId, historyId, status, taskDate);
            }
        }} style={{textAlign:"center"}}>
            <img src={img} alt="TaskIcon"/>
        </Box>
    );
}