import React, { useEffect } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import styles from "../assets/styles/headerStyle.js";
//logo
import Logo from '../assets/icons/Logo.png';
import { Link } from "react-router-dom";

const useStyles = makeStyles(styles);

export default function Header(props) {
    const classes = useStyles();
    useEffect(() => {
        if (props.changeColorOnScroll) {
            window.addEventListener("scroll", headerColorChange);
        }
        return function cleanup() {
            if (props.changeColorOnScroll) {
                window.removeEventListener("scroll", headerColorChange);
            }
        };
	});
	
    const headerColorChange = () => {
        const { color, changeColorOnScroll } = props;
        const windowsScrollTop = window.pageYOffset;
        if (windowsScrollTop > changeColorOnScroll.height) {
            document.body
                .getElementsByTagName("header")[0]
                .classList.remove(classes[color]);
            document.body
                .getElementsByTagName("header")[0]
                .classList.add(classes[changeColorOnScroll.color]);
            let x = document.body.getElementsByTagName("header")[0];
            let y = x.getElementsByTagName("a");
            let i;
            for (i = 0; i < y.length; i++) {
                y[i].classList.add(classes["whiteLink"]);
            }
            document.body
                .getElementsByTagName("header")[0].getElementsByTagName("button")[0]
                .classList.remove(classes["greyLink"]);
            document.body
                .getElementsByTagName("header")[0].getElementsByTagName("button")[0]
                .classList.add(classes["whiteLink"]);
        } else {
            document.body
                .getElementsByTagName("header")[0]
                .classList.add(classes[color]);
            document.body
                .getElementsByTagName("header")[0]
                .classList.remove(classes[changeColorOnScroll.color]);
            let x = document.body.getElementsByTagName("header")[0];
            let y = x.getElementsByTagName("a");
            let i;
            for (i = 0; i < y.length; i++) {
                y[i].classList.remove(classes["whiteLink"]);
            }
            document.body
                .getElementsByTagName("header")[0].getElementsByTagName("button")[0]
                .classList.remove(classes["whiteLink"]);
                document.body
                .getElementsByTagName("header")[0].getElementsByTagName("button")[0]
                .classList.add(classes["greyLink"]);
        }
	};
	
	const { color, links, fixed, absolute } = props;
	
    const appBarClasses = classNames({
        [classes.appBar]: true,
        [classes[color]]: color,
        [classes.absolute]: absolute,
        [classes.fixed]: fixed,
    },
    classes.greyLink);

    return (
        <AppBar className={appBarClasses}>
            <Toolbar className={classes.container}>
                <Link to='/' >
                    <Button className={classNames(classes.title,classes.greyLink)}>
                        <img src={Logo} style={{width: 30, marginRight: 10}} />
                        HABIT TRACKER
                    </Button>
                </Link>
                <Hidden smDown implementation="css">
                    {links}
                </Hidden>
            </Toolbar>
        </AppBar>
    );
}
