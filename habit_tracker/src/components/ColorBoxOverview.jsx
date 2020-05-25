import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Tooltip } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        display: 'table-cell',
        width: 25,
        height: 21,
        border: '1px solid #F3F7F7',
        padding: 0,
        margin: 0,
        borderCollapse: "separate",
        borderSpacing: 0
    },
});

export default function ColorBoxOverview(props) {
    const classes = useStyles();
    const { id, color, date, highlightId, updateData } = props;
    const tooltipDate = date.slice(0, 10);
    let customStyles = { backgroundColor: color };

    return (
        <Tooltip title={tooltipDate}>
            <Paper square elevation={0} className={classes.root} style={customStyles} />
        </Tooltip>
    );
}