import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
    root: {
        width: 60,
        height: 60,
        display: 'table-cell',
        '&:hover': {
            cursor: 'pointer',
            width: 58,
            height: 58,
            border: '1px solid #778181' 
        }
    },
});

export default function ColorBox(props) {
    const classes = useStyles();
    const { id, name, habitId, updateData, color, status, date } = props;
    let customStyles = { backgroundColor: color };

    // TODO: Rewrite this part and change Paper with something else
    if (status === 2) {
        customStyles.backgroundColor = "#FFFFFF";
        customStyles.backgroundImage = '-webkit-linear-gradient(45deg, ' + color + ' 50%, #FFFFFF 50%)';
    } 
    else if (status === 0) {
        customStyles.backgroundColor = "#FFFFFF";
    }

    const handleMouseHover = () => {
        // console.log(date);
    }

    return (
        <Paper 
            square
            elevation={0}
            className={classes.root}
            style={customStyles}
            onClick={() => updateData({id, name, date, status, habitId}, 0)}
            onMouseEnter={handleMouseHover}
            onContextMenu={e => {
                e.preventDefault();
                updateData({id, name, date, status, habitId}, 1)
            }}
        />
    );
}