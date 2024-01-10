import { combineReducers } from "@reduxjs/toolkit";
import bolaoReducer from "./bolaoReducer";

const rootReducer = combineReducers({
    bolao: bolaoReducer
});

export default rootReducer;