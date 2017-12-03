import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import opLogin from './opLogin';
import opGroups from './opGroups';
import opMap from './opMap';
import opOptions from "./opOptions";

// TODO les autres reducers a rajouter ici


const appReducer = combineReducers({
    routerReducer,
    opLogin,
    opGroups,
    opMap,
    opOptions
});

const rootReducer = (state, action) => {
    switch (action.type) {

        default:
            break;
    }
    return appReducer(state, action);
};

export default rootReducer;
