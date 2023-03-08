import { combineReducers } from "redux";
import settings from "./settings/Reducer"; 
import serverReducer from "./server/reducer"; 
const reducers = combineReducers({
  settings, 
  server:serverReducer
});

export default reducers;
