import {CHANGE_DESCRIPTION, DRAW, SET_DRAWINGS} from "../actions/opCanvas";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    errors: '',
    draw: false,
    drawings: '',
    description: '',
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case DRAW:
            return {...state , draw: action.boolean, error:''};
        case SET_DRAWINGS:
            return {...state, drawings: action.drawings, error:''};
        case CHANGE_DESCRIPTION:
            return {...state, description: action.description, error:''};
        default:
            return state
    }

}