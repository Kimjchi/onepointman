import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';

// TODO les autres reducers a rajouter ici


const appReducer = combineReducers({
    routerReducer,

});

const rootReducer = (state, action) => {
    switch (action.type) {

        default:
            break;
    }
    return appReducer(state, action);
};

export default rootReducer;
