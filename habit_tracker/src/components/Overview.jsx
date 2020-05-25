import * as React from 'react';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Container, Box } from '@material-ui/core';
import { habitService } from '../services/habits.service';
import ColorBoxOverview from './ColorBoxOverview';

const useStyles = makeStyles({
    root: {
        width: '100%',
        overflowX: 'auto',
        paddingTop: 30
    },
    fab: {
        backgroundColor: '#3DC1C1'
    },
    overviewBox: {
        width: 60,
        display: 'inline-block',
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 10,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 100,
        marginRight: 10
    },
    overviewTitle: {
        fontSize: 50,
        color: '#778181',
        margin: 100,
    },
    overviewNumbers: {
        color: '#778181',
        fontSize: 25,
    }
});

export default function Overview() {
    // TODO: GENERATE THE TABLE EVEN IF THERE IS NO HABIT
    // TODO: CHECK FOR DIVIDE BY 0
    const classes = useStyles();
    const [values, setValues] = useState([]);
    const [reload, setReload] = useState(false);
    const [habitsNumber, setHabitsNumber] = useState(0);
    const [doneDaysNumber, setDoneDaysNumber] = useState(0);
    const [dailyAverage, setDailyAverage] = useState(0);
    const [averageCompletionRate, setAverageCompletionRate] = useState(0);
    let matrix = [];

    useEffect(() => {
        const fetchAll = async () => {
            return await Promise.all([habitService.getHabits(), habitService.getHabitsHistoryAnnually()])
                .then(response => {
                    const habits = response[0];
                    const history = response[1];
                    const historyLen = history.length;
                    let historyIndex = 0;
                    let doneDaysCounter = 0;
                    let average = 0;
                    let sum = 0;
                    let percent = 0;

                    if (history && historyLen) {
                        for (let i = 0; i < 26; i++) {
                            matrix[i] = new Array(14);
                            for (let j = 0; j < 14; j++) {
                                matrix[i][j] = history[historyIndex];
                                if (matrix[i][j].counter != 0) {
                                    doneDaysCounter++;
                                    sum += matrix[i][j].counter;
                                }
                                if (historyIndex < historyLen - 1) {
                                    historyIndex++;
                                }
                            }
                        }
                    }
                    if(sum && doneDaysCounter){
                        average = (sum / doneDaysCounter).toFixed(2);;
                        percent = Math.floor((average / habits.length) * 100)
                    }

                    setDailyAverage(average);
                    setAverageCompletionRate(percent);
                    setDoneDaysNumber(doneDaysCounter);
                    setHabitsNumber(habits.length);
                    setValues(matrix);
                })
                .catch(err => console.log(err))
        }

        fetchAll()
    }, [reload]);

    const hexToRgb = (hex, alfa) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        
        let r = parseInt(result[1], 16);
        let g = parseInt(result[2], 16);
        let b = parseInt(result[3], 16);

        return result ? "rgb(" + r + ", " + g + ", " + b + ", " + alfa +  ")" : null;
    };

    return (
        <Container>
            <Paper elevation={10} className={classes.root}>                
                <Grid container>
                    <Grid item xs={6} style={{display: 'inline'}}>
                        <Box component="div" display="inline" className={classes.overviewTitle}>Overview</Box>
                        <br/><br/>
                        <Box className={classes.overviewBox} style={{backgroundColor: hexToRgb('#3DC1C1', 1)}}>
                            <span className={classes.overviewNumbers}>
                                {habitsNumber}
                            </span>
                        </Box>
                        <span className={classes.overviewNumbers}>
                            Habits
                        </span>
                        <br/>
                        <Box className={classes.overviewBox} style={{backgroundColor: hexToRgb('#3DC1C1', (dailyAverage / habitsNumber))}}>
                            <span className={classes.overviewNumbers}>
                                {dailyAverage}
                            </span>
                        </Box>
                        <span className={classes.overviewNumbers}>
                            Daily Average
                        </span>
                        <br/>
                        <Box className={classes.overviewBox} style={{backgroundColor: hexToRgb('#3DC1C1', (doneDaysNumber / 365))}}>
                            <span className={classes.overviewNumbers}>
                                {doneDaysNumber}
                            </span>
                        </Box>
                        <span className={classes.overviewNumbers}>
                            Done days
                        </span>
                        <br/>
                        <Box className={classes.overviewBox} style={{backgroundColor: hexToRgb('#3DC1C1', (dailyAverage / habitsNumber))}}>
                            <span className={classes.overviewNumbers}>
                                {averageCompletionRate}%
                            </span>
                        </Box>
                        <span className={classes.overviewNumbers}>
                            Average Completion Rate
                        </span>
                    </Grid>
                    <Grid item xs={6}>
                        {values.map(row => {
                            return (
                                <Container>
                                    <Grid>
                                        {row.map(entry => {
                                            const newColor = (entry && entry.hasOwnProperty('counter')) ? hexToRgb("#3DC1C1", (entry.counter / habitsNumber)) : "#3DC1C1";
                                            return <ColorBoxOverview date={entry.date} color={newColor} />
                                        })}
                                    </Grid>
                                </Container>
                            )
                        })}
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}