import React, { useState } from "react";
import { connect } from "react-redux";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import SaveOutlinedIcon from "@material-ui/icons/SaveOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@material-ui/icons/PlayCircleFilledWhiteOutlined";
import RefreshRoundedIcon from "@material-ui/icons/RefreshRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import CodeRoundedIcon from "@material-ui/icons/CodeRounded";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import clsx from "clsx";
import { sortableElement, sortableHandle } from "react-sortable-hoc";
import { map } from "lodash";
import { MenuItem, Select } from "@material-ui/core";
import axios from "axios";

//styles
import useStyles from "../component.style";

// components
import CodeEditor from "./CodeEditor";
import ResultComponent from "./Result";

// reducer action
import { UPDATE_COMPONENTS } from "../../../redux/actions/notebooks.action";
import { SET_NOTIFICATION } from "../../../redux/actions/notification.action";

// axios config
import createConfig from "../../AppStructure/Profile/form_axios.config";

const CodeComponent = ({
  component,
  idx,
  deleteHandler,
  editHandler,
  updateComponent,
  notebookId,
  setNotification,
}) => {
  const classes = useStyles();

  // code state
  const [code, setCode] = useState(
    !!component.value ? component.value : `// Type your code here\n`
  );

  // theme state
  const [theme, setTheme] = useState("monokai");
  const themeArray = [
    "monokai",
    "github",
    "tomorrow",
    "twilight",
    "kuroir",
    "xcode",
    "textmate",
    "terminal",
    "solarized_dark",
    "solarized_light",
  ];

  // Theme Change Handler
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  //Drag handler
  const DragHandle = sortableHandle(() => (
    <span className={classes.component_icon} title="Move Vertically">
      <CodeRoundedIcon />
    </span>
  ));

  // for running code
  const [run, setRun] = useState(false);

  // result state
  const [result, setResult] = useState([]);

  // code runner
  const evaluate_code = async () => {
    let formData = new FormData();
    formData.append("code", code);
    let resultArr = [];
    try {
      let response = await axios.post(
        "http://localhost:5000/api/public/compile",
        formData,
        createConfig()
      );

      resultArr = response.data.data.result.split("\n");

      // compilattion successful
      setNotification({
        open: true,
        severity: "success",
        msg: response.data.msg,
      });

      setResult(resultArr);
    } catch (error) {
      if (!!error.response.data.data.err) {
        if (!!error.response.data.data.err.error)
          resultArr.push(`>>> ${error.response.data.data.err.error}`);
        if (!!error.response.data.data.err.errorCause)
          resultArr.push(error.response.data.data.err.errorCause);
        if (!!error.response.data.data.err.errorType)
          resultArr.push(
            `ErrorType: ${error.response.data.data.err.errorType}`
          );
      }

      setResult(resultArr);

      // compilattion failed
      setNotification({
        open: true,
        severity: "error",
        msg: !!error.response.data
          ? error.response.data.msg
          : "internal error, try again!!",
      });
    }
  };

  const playHandler = () => {
    setRun(true);
    evaluate_code();
  };

  const refreshHandler = () => {
    setResult([]);
  };

  const closeHandler = () => {
    setRun(false);
  };

  const saveHandler = (idx) => {
    updateComponent(notebookId, idx, code);
    setNotification({
      open: true,
      severity: "success",
      msg: "Code Saved Successfully",
    });
  };

  return (
    <div className={classes.split_wrapper}>
      <div
        className={classes.component_wrapper}
        key={idx}
        onDoubleClick={() => editHandler(idx)}
      >
        <h3 className={classes.input}>{`In [ ${idx + 1} ] : `}</h3>
        <div
          className={clsx({
            [classes.component_code]: !run,
            [classes.shrink_component]: run,
          })}
          style={{ height: "200px" }}
        >
          <CodeEditor theme={theme} run={run} code={code} setCode={setCode} />

          {/* ----------------------- */}

          <Select
            value={theme}
            onChange={handleThemeChange}
            className={classes.code_theme}
            disableUnderline={true}
          >
            {map(themeArray, (name, idx) => (
              <MenuItem value={name} key={idx}>
                {name}
              </MenuItem>
            ))}
          </Select>

          {/* ----------------------- */}

          <DeleteOutlineOutlinedIcon
            className={classes.delete_icon}
            onClick={() => deleteHandler(idx)}
          />
          <SaveOutlinedIcon
            className={classes.edit_icon}
            onClick={() => saveHandler(idx)}
          />
          <PlayCircleFilledWhiteOutlinedIcon
            className={classes.play_icon}
            onClick={() => playHandler(idx)}
          />
          <DragHandle />
        </div>
      </div>

      {run && (
        <div
          className={clsx(classes.component_wrapper, {
            [classes.move_shrink_component]: run,
          })}
          key={`split - ${idx}`}
          onDoubleClick={() => editHandler(idx)}
        >
          <h3 className={classes.output}>{`Out [ ${idx + 1} ] : `}</h3>
          <div className={classes.shrink_component}>
            <ResultComponent result={result} />
            <RefreshRoundedIcon
              className={classes.edit_icon}
              onClick={() => refreshHandler(idx)}
            />
            <CloseRoundedIcon
              className={classes.delete_icon}
              onClick={() => closeHandler(idx)}
            />
            <CompareArrowsIcon className={classes.component_icon} />
          </div>
        </div>
      )}
    </div>
  );
};

//Draggable elements
const SortableItem = sortableElement((props) => {
  return <CodeComponent {...props} />;
});

const mapStateToProps = (state) => {
  return {
    notebookId: state.activeTab,
  };
};

const mapActionToProps = (dispatch) => {
  return {
    updateComponent: (id, componentIdx, value) => {
      dispatch({
        type: UPDATE_COMPONENTS,
        payload: { id, componentIdx, value },
      });
    },
    setNotification: (data) => {
      dispatch({
        type: SET_NOTIFICATION,
        payload: { ...data },
      });
    },
  };
};

export default connect(mapStateToProps, mapActionToProps)(SortableItem);
