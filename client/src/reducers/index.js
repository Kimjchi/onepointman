import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import opLogin from './opLogin';
import opGroups from './opGroups';

// TODO les autres reducers a rajouter ici


const appReducer = combineReducers({
    routerReducer,
    opLogin,
    opGroups
});

const rootReducer = (state, action) => {
    switch (action.type) {

        default:
            break;
    }
    return appReducer(state, action);
};

export default rootReducer;
