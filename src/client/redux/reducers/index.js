import { combineReducers } from "redux";

// reducers
import signReducer from "./sign.reducer";
import notificationReducer from "./notification.reducer";
import userReducer from "./user.reducer";
import notebooksReducer from "./notebooks.reducer";
import tabReducer from "./tabbar.reducer";

export default combineReducers({
  signData: signReducer,
  notification: notificationReducer,
  userData: userReducer,
  notebooks: notebooksReducer,
  tab: tabReducer,
});
