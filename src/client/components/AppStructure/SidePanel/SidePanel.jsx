import React, { useRef } from "react";
import { withRouter } from "react-router";
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
import html2canvas from "html2canvas";
import jspdf from "jspdf";

// styles
import useStyles from "./sidePanel.style";

// components
import Navbar from "../NavBar/Navbar";
import Tools from "./Tools";

// All Buttons
import { mainButtons, notebookButtons } from "./buttons";

// reducer actions
import { signin } from "../../../redux/actions/sign.action";
import { ADD_NOTEBOOK } from "../../../redux/actions/notebooks.action";
import { SHIFT, UNSHIFT } from "../../../redux/actions/tabbar.action";

const SidePanel = ({
  isSignIn,
  toggleSignIn,
  children,
  history,
  addNotebook,
  shift,
  unshift,
}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  // ref for download as pdf
  const pdfRef = useRef();

  // For pdf------------------------------------------------------------------------
  const createPdf = async () => {
    try {
      let canvas = await html2canvas(pdfRef.current);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jspdf({
        format: "a4",
      });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("download.pdf");
    } catch (err) {
      console.log(err);
    }
  };

  // --------------------------------------------------------------------------------

  const handleDrawerOpen = () => {
    setOpen(true);
    shift();
  };

  const handleDrawerClose = () => {
    setOpen(false);
    unshift();
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
          {mainButtons(isSignIn, toggleSignIn, history, addNotebook).map(
            (button, index) => {
              const { name, Icon, onClick, label } = button;
              return (
                <ListItem
                  button
                  key={index}
                  onClick={onClick}
                  className={classes.mainButton}
                >
                  <ListItemIcon title={label}>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItem>
              );
            }
          )}
        </List>
        <Divider />
        <List>
          {notebookButtons(isSignIn, toggleSignIn, handleClick).map(
            (button, index) => {
              const { name, Icon, onClick, label } = button;
              return (
                <ListItem
                  button
                  key={index}
                  onClick={name === "Download" ? createPdf : onClick}
                  className={classes.notebookButton}
                >
                  <ListItemIcon title={label}>
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
      <main className={classes.content} ref={pdfRef}>
        {/* <div className={classes.toolbar} /> */}
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
    addNotebook: () =>
      dispatch({
        type: ADD_NOTEBOOK,
      }),
    shift: () =>
      dispatch({
        type: SHIFT,
      }),
    unshift: () =>
      dispatch({
        type: UNSHIFT,
      }),
  };
};

export default connect(
  mapStateToProps,
  mapActionToProps
)(withRouter(SidePanel));
