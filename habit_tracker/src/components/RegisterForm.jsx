import React from 'react';
import clsx from 'clsx';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import { green} from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& label.Mui-focused': {
      color: 'green',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green',
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: 'green',
      },
    },
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: 200,
  },
}));

const ColorButton = withStyles(theme => ({
  root: {
    color: 'white',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);

export default function InputAdornments() {
  const classes = useStyles();

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  const [values, setValues] = React.useState({
    gender: '',
    showPassword: false,
  });
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  function register() {
        let data = new FormData();
        console.log(email);

    
  }

  return (
    <div className={classes.root}>
      <div>
        <div>
        <TextField
          label="FirstName"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          onChange={e => setFirstName(e.target.value)}
        />
        </div>
        <div>
        <TextField
          label="LastName"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          onChange={e => setLastName(e.target.value)}
        />
        </div>
        <div>
        <TextField
          label="Email"
          id="outlined-start-adornment"
          className={clsx(classes.margin, classes.textField)}
          variant="outlined"
          onChange={e => setEmail(e.target.value)}
        />
        </div>
        <div>
        <FormControl variant="outlined" className={clsx(classes.margin, classes.textField)}>
          <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
            Gender
          </InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            value={values.gender}
            onChange={handleChange('gender')}
            labelWidth={labelWidth}
          >
            <MenuItem value={"M"}>M</MenuItem>
            <MenuItem value={"F"}>F</MenuItem>
          </Select>
        </FormControl>
        </div>
        <div>
        <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? 'text' : 'password'}
            value={values.password}
            onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
        </div>
        <div>
        <ColorButton variant="contained" className={classes.margin} onClick={register}>
          Register
        </ColorButton>
        </div>
      </div>
    </div>
  );
}
