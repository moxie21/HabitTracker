import * as React from 'react';
import { toServerDateTimeFormat } from '../helpers/dateFunctions';
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Grid, Container, Box, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import ColorPicker from "material-ui-color-picker";
import ColorBoxHighlight from './ColorBoxHighlight';
import { highlightService } from '../services/highlights.service';
import DialogAddHighlight from './DialogAddHighlight';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        overflowX: 'auto',
        paddingTop: 30
    },
    text: {
		fontSize: 30,
		color: '#3DC1C1',
        textAlign: "center",
        margin: 20
	},
    habitTitleBox: {
        width: 150,
        height: 60,
        display: 'table-cell',
        fontSize: 20,
        color: '#778181',
        paddingLeft: 20,
        paddingRight: 10
    },
    fab: {
        backgroundColor: '#3DC1C1'
    },
    overviewTitle: {
        fontSize: 50,
        margin: '10%'
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

const initialEditDialogValues = {
    id: '',
    name: '',
    description: '',
    color: ''
}

export default function HighlightsCalendar() {
    const classes = useStyles();
    const [values, setValues] = useState({});
    const [reload, setReload] = useState(false);
    const [editHighlightModalOpen, setEditHighlightModalOpen] = useState(false);
    const [editValues, setEditValues] = useState(initialEditDialogValues);

    let matrix = [];

    useEffect(() => {        
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const endDate = new Date(currentDate.getFullYear(), 11, 31);

        const incrementDate = (date, days) => {
            let auxDate = new Date(date);
            auxDate.setDate(auxDate.getDate() + days);
            return auxDate;
        };

        const allRequests = async () => {
            return Promise.all([highlightService.getHighlights(), highlightService.getHighlightsHistory()])
                .then(response => {
                    const highlights = response[0];
                    const history = response[1];

                    let stateValues = {};
                    let historyIndex = 0;

                    const getActivityList = id => {
                        let tempDate = new Date(startDate);
                        let activityList = [];
                        let activityListIndex = -1;
                        let auxObj = {};
                        let whileIndex = 0;

                        while (tempDate.getTime() <= endDate.getTime()) {
                            if (whileIndex % 14 === 0) {
                                activityList[++activityListIndex] = new Array();
                            }

                            const historyRow = history ? history[historyIndex] : null;

                            if (historyRow && historyRow.date === toServerDateTimeFormat(tempDate) && historyRow.highlightId === id) {
                                auxObj = {
                                    id: historyRow.id,
                                    date: historyRow.date,
                                    status: 1
                                }
                                if (historyIndex < history.length - 1) {
                                    historyIndex++;
                                }
                            }
                            else {
                                auxObj = {
                                    id: null,
                                    date: toServerDateTimeFormat(tempDate),
                                    status: 0
                                }
                            }

                            activityList[activityListIndex].push(auxObj);
                            tempDate = incrementDate(tempDate, 1);
                            whileIndex++;
                        }
                        
                        return activityList;
                    };

                    highlights.forEach(highlight => {
                        const { id, color, description } = highlight;

                        stateValues = {
                            ...stateValues,
                            [highlight.name]: {
                                id,
                                color,
                                description,
                                activityList: getActivityList(highlight.id)
                            }
                        }
                    });

                    setValues(stateValues);
                })
                .catch(err => console.log(err))
        }

        allRequests();
    }, [reload]);

    const updateCalendar = () => {
        setReload(!reload);
    };

    const updateDataOnClick = (historyId, date, highlightId) => {
        if (historyId) {
            highlightService.deleteHighlightHistory(historyId)
                .then(res => updateCalendar())
                .catch(err => console.log(err))
        }
        else {
            highlightService.addHighlightHistory(highlightId, date)
                .then(res => updateCalendar())
                .catch(err => console.log(err))
        }
    }

    const openEditHighlightDialog = (id, name, description, color) => {
        setEditValues({id, name, description, color});
        setEditHighlightModalOpen(true);
    }

    const dialogResetForm = () => {
        setValues({ ...initialEditDialogValues });
        // setErrors({});
    };

    const dialogHandleClickOpen = () => {
        setEditHighlightModalOpen(true);
    };

    const dialogHandleClose = () => {
        setEditHighlightModalOpen(false);
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
        
        highlightService.updateHighlight(editValues)
            .then(res => {
                console.log(res);
                dialogHandleClose();
                updateCalendar();
            })
            .catch(err => console.log(err))
    };

    const dialogDeleteHighlight = (e) => {
        e.preventDefault();

        highlightService.deleteHighlight(editValues.id)
            .then(res => {
                dialogHandleClose();
                updateCalendar();
            })
            .catch(err => console.log(err))
        //DELETE
    };

    return (
        <Container style={{maxWidth:'100%'}}>
            <Paper elevation={10} className={classes.root}>
                <Grid container>
                    {Object.keys(values).map(((highlight, key) => {
                        const matrix = values[highlight].activityList;
                        return (
                                <Grid item xs={3}>
                                    <Box component="div" display="inline" onClick={() => {openEditHighlightDialog(values[highlight].id, highlight, values[highlight].description, values[highlight].color)}} className={classes.text} style={{color: values[highlight].color}}>{highlight}</Box>
                                    <br/><br/>
                                    {matrix.map(row => {
                                        return (
                                            <Container>
                                                <Grid>
                                                    {row.map(entry => {
                                                        const newColor = entry.status ? values[highlight].color : "#FFFFFF";
                                                        return <ColorBoxHighlight updateData={updateDataOnClick} id={entry.id} highlightId={values[highlight].id} date={entry.date} color={newColor} />
                                                    })}
                                                </Grid>
                                            </Container>
                                        )
                                    })}
                                </Grid> 
                        )
                    }), values)}

                    <Grid item xs={3}>
                        <Container>
                            <Grid>
                                <Container>
                                    <DialogAddHighlight updateParent={updateCalendar} />
                                </Container>
                            </Grid>
                        </Container>
                    </Grid>
                </Grid>
            </Paper>

            <Dialog
                open={editHighlightModalOpen}
                onClose={dialogHandleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Edit Highlight"}
                </DialogTitle>
				<form autoComplete="off" noValidate onSubmit={dialogHandleSubmit}>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<Grid container>
								<Grid item xs={12}>
									<TextField
										className={classes.dialogTextField}
										label="Highlight Name"
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
										defaultValue={'Highlight Color'}
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
                            onClick={dialogDeleteHighlight}
                            style={{ marginRight: "auto" }}
                        >    <DeleteIcon color="secondary" fontSize="large"/>
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