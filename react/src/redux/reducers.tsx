import { combineReducers } from "redux"; 
import serverReducer from "./server/reducer"; 
const reducers = combineReducers({ 
  server:serverReducer
}); 
export default reducers;
