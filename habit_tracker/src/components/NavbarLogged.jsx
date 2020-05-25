import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
// components
import Header from "./Header.jsx";
import Button from "./Button.jsx";

// @material-ui/icons
import AccountCircle from "@material-ui/icons/AccountCircle";
//styles
import styles from "../assets/styles/navbarsStyle.js";
import { Link } from "react-router-dom";

const useStyles = makeStyles(styles);

export default function NavbarLogged() {
    const classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user'));
    const firstName = user.firstName;
    const lastName = user.lastName;

    return (
        <div className={classes.container}>
            <Header
                color="white"
                fixed
                changeColorOnScroll={{
                    height: 200,
                    color: "primary",
                }}
                links={
                    <List className={classes.list}>
                        <ListItem className={classes.listItem}>
                            <Link to='/habits' style={{ color: '#626262', textDecoration: 'none' }}>
                                <Button
                                    className={classes.navLink}
                                    color="transparent"
                                >
                                    Habits
                                </Button>
                            </Link>
                        </ListItem>
                        <ListItem className={classes.listItem}>
                            <Link to='/tasks' style={{ color: '#626262', textDecoration: 'none' }}>
                                <Button
                                    className={classes.navLink}
                                    color="transparent"
                                >
                                    Tasks
                                </Button>
                            </Link>
                        </ListItem>
                        <ListItem className={classes.listItem}>
                            <Link to='/highlights' style={{ color: '#626262', textDecoration: 'none' }}>
                                <Button
                                    className={classes.navLink}
                                    color="transparent"
                                >
                                    Higlights
                                </Button>
                            </Link>
                        </ListItem>
                        <ListItem className={classes.listItem}>
                            <Link to="/login" style={{ color: '#626262', textDecoration: 'none' }}>
                                <Button
                                    className={classes.navLink}
                                    color="transparent"
                                >
                                    <AccountCircle className={classes.icons} /> 
                                    {`${firstName} ${lastName}`}
                                </Button>
                            </Link>
                        </ListItem>
                    </List>
                }
            />
        </div>
    );
}
