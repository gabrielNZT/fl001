import { combineReducers } from "@reduxjs/toolkit";
import bolaoReducer from "./BolaoReducer";

const rootReducer = combineReducers({
    bolao: bolaoReducer
});

export default rootReducer;