import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import {
    IconButton,
    OutlinedInput,
    InputLabel,
    InputAdornment,
    FormControl,
    TextField,
    Visibility,
    VisibilityOff,
    MenuItem,
    Select,
    InputBase,
    Button,
    Grid,
} from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
// import BasicDatePicker from './BasicDatePicker';

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

const ColorButton = withStyles((theme) => ({
    root: {
        display: "block",
        background: "linear-gradient(45deg, #3CAA9D 30%, #1EE0D8 90%)",
        borderRadius: 3,
        border: 0,
        color: "white",
        height: 48,
        padding: "0 30px",
        boxShadow: "0 3px 5px 2px #E5E5E5",
        marginTop: theme.spacing(3),
    },
}))(Button);

const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    gender: '',
    country: ''
    // selectedDate
};

export default function InputAdornments() {
    const classes = useStyles();
    const { addToast } = useToasts();
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const inputLabel = useRef(null);
    const [labelWidth, setLabelWidth] = useState(0);
    useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleInputChange = e => {
        const { name, value } = e.target;
        const fieldValue = { [name]: value };

        console.log(e.target);

        setValues({
            ...values,
            ...fieldValue
        });
        
        validate(fieldValue);
    };

    const validate = (fieldValues = values) => {
        let temp = {};

        console.log(fieldValues);

        if ('firstName' in fieldValues) {
            temp.firstName = fieldValues.firstName ? "" : "This field is required.";
        }
        if ('lastName' in fieldValues) {
            temp.lastName = fieldValues.lastName ? "" : "This field is required.";
        }
        if ('email' in fieldValues) {
            temp.email = (/^$|.+@.+..+/).test(fieldValues.email) ? "" : "Please enter a valid email";
        }
        if ('password' in fieldValues) {
            temp.password = fieldValues.password ? "" : "This field is required.";
        }
        if ('gender' in fieldValues) {
            temp.gender = fieldValues.gender ? "" : "This field is required.";
        }
        if ('country' in fieldValues) {
            temp.country = fieldValues.country ? "" : "This field is required.";
        }

        setErrors({...temp});

        if (fieldValues === values) {
            return Object.values(temp).every(s => s === "");
        }
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (validate()) {
            const onSuccess = () => {
                addToast("User registered successfully", { appearance: 'success' });
            }
        }
    };

    return (
        <form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        className={classes.textField}
                        label="FirstName"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleInputChange}
                        {...(errors.firstName && { error: true, helperText: errors.firstName })}
                    />
                    <TextField
                        className={classes.textField}
                        label="LastName"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleInputChange}
                        {...(errors.lastName && { error: true, helperText: errors.lastName })}
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
                        {...(errors.password && { error: true, helperText: errors.password })}
                        type="password"
                        autoComplete="current-password"
                    />
                    <FormControl className={classes.formControl}>
                        <InputLabel ref={inputLabel}>Gender</InputLabel>
                        <Select
                            className={classes.select}
                            value={values.gender}
                            labelWidth={labelWidth}
                        >
                            <MenuItem value={"M"}>M</MenuItem>
                            <MenuItem value={"F"}>F</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        className={classes.textField}
                        label="Country"
                        name="country"
                        value={values.country}
                        onChange={handleInputChange}
                        {...(errors.country && { error: true, helperText: errors.country })}
                    />
                    {/* <BasicDatePicker/> */}
                    <ColorButton
                        variant="contained"
                        className={classes.margin}
                        type="submit"
                    >
                        Register
                    </ColorButton>
                </Grid>
            </Grid>
        </form>
    );
}

{
    /* <InputLabel>
                    Password
                </InputLabel>
                <OutlinedInput
                    type={values.showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange("password")}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {values.showPassword ? (
                                    <Visibility />
                                ) : (
                                    <VisibilityOff />
                                )}
                            </IconButton>
                        </InputAdornment>
                    }
                    labelWidth={70}
                /> */
}
