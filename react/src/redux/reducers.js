import { combineReducers } from "redux";
import settings from "./settings/Reducer";
import chatReducer from "./chats/Reducer";
import notesReducer from "./notes/Reducer";
import contactReducer from "./contacts";
import maincontactReducer from "./contacts/Contacts";
import emailReducer from "./email";
import maintodoReducer from "./todos/Todos";
import todoReducer from "./todos";
import serverReducer from "./server/reducer"; 
const reducers = combineReducers({
  settings,
  chatReducer,
  contactReducer,
  emailReducer,
  notesReducer,
  todoReducer,
  maintodoReducer,
  maincontactReducer,
  server:serverReducer
});

export default reducers;
