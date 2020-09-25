import React from "react";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { connect } from "react-redux";
import { isEmpty } from "lodash";

// styles
import useStyles from "./sidePanel.style";

// components
import Navbar from "../NavBar/Navbar";
import Tools from "./Tools";

// All Buttons
import { mainButtons, notebookButtons } from "./buttons";

// reducer actions
import { signin } from "../../redux/actions/sign.action";

const SidePanel = ({ isSignIn, toggleSignIn, children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Navbar onDrawerClick={handleDrawerOpen} />
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        <List>
          {mainButtons(isSignIn, toggleSignIn).map((button, index) => {
            const { name, Icon, onClick } = button;
            return (
              <ListItem
                button
                key={index}
                onClick={onClick}
                className={classes.mainButton}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <List>
          {notebookButtons(isSignIn, toggleSignIn, handleClick).map(
            (button, index) => {
              const { name, Icon, onClick } = button;
              return (
                <ListItem
                  button
                  key={index}
                  onClick={onClick}
                  className={classes.notebookButton}
                >
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              );
            }
          )}
        </List>
        <Tools anchorEl={anchorEl} handleClose={handleClose} />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    isSignIn: !isEmpty(state.userData),
  };
};

const mapActionToProps = (dispatch) => {
  return {
    toggleSignIn: () => {
      dispatch({
        type: signin,
      });
    },
  };
};

export default connect(mapStateToProps, mapActionToProps)(SidePanel);