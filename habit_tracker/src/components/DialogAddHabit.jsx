import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
	Box
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import ColorPicker from "material-ui-color-picker";
import { habitService } from '../services/habits.service';

const useStyles = makeStyles((theme) => ({
    root: {},
    fab: {
		backgroundColor: "#3DC1C1",
		margin: 20
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
	text: {
		fontSize: 30,
		color: '#3DC1C1',
		textAlign: "center",
	}
}));

const initialValues = {
	name: '',
	description: '',
	color: '#3DC1C1'
};

export default function DialogAddHabit(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
	const [values, setValues] = useState(initialValues);
	// const [errors, setErrors] = useState({});
	// TODO: write logic for errors
	
	const validate = () => {
		// TODO: write validate function
	}

	const resetForm = () => {
		setValues({...initialValues});
		// setErrors({});
	};

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
	};
	
	const handleInputChange = e => {
		const { name, value } = e.target;
		const fieldValue = { [name]: value };

		setValues({
			...values,
			...fieldValue
		});

		validate();
	};

	const handleSubmit = e => {
		e.preventDefault();

		habitService.addHabit(values)
			.then(res => {
				handleClose();
				props.updateParent();
				resetForm();
			})
			.catch(err => console.log(err));
	}

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
                    {"Add new Habit"}
                </DialogTitle>
				<form autoComplete="off" noValidate onSubmit={handleSubmit}>
					<DialogContent>
						<DialogContentText id="alert-dialog-description">
							<Grid container>
								<Grid item xs={12}>
									<TextField
										className={classes.textField}
										label="Habit Name"
										name="name"
										value={values.name}
										onChange={handleInputChange}
										// {...(errors.firstName && {
										//     error: true,
										//     helperText: errors.firstName,
										// })}
									/>
									<TextField
										className={classes.textField}
										label="Short Description"
										name="description"
										value={values.description}
										onChange={handleInputChange}
										// {...(errors.firstName && {
										//     error: true,
										//     helperText: errors.firstName,
										// })}
									/>
									<ColorPicker
										name="color"
										defaultValue={'Habit Color'}
										value={values.color}
										onChange={color => setValues({...values, color})}
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
						<Button onClick={handleClose} color="primary">
							CANCEL
						</Button>
						<Button type="submit" color="primary" autoFocus>
							SAVE
						</Button>
					</DialogActions>
				</form>
            </Dialog>
			<Box component="div" display="inline" className={classes.text}>New Habit</Box>
        </>
    );
}
