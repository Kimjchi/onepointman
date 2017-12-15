import {
    BIND_DRAWINGS_GROUP, CHANGE_DESCRIPTION, DRAW, SET_DRAWING_TO_SHOW, SET_DRAWINGS,
    SHOW_DRAWING, TRANSITION
} from "../actions/opCanvas";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    errors: '',
    draw: false,
    drawings: '',
    description: '',
    drawingsGroup: [],
    showDrawing: false,
    drawingToShow: {},
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case DRAW:
            return {...state , draw: action.boolean, error:''};
        case SET_DRAWINGS:
            return {...state, drawings: action.drawings, error:''};
        case CHANGE_DESCRIPTION:
            return {...state, description: action.description, error:''};
        case BIND_DRAWINGS_GROUP:
            return {...state, drawingsGroup: action.drawings, error:''};
        case SHOW_DRAWING:
            return {...state, showDrawing: action.boolean, error:''};
        case SET_DRAWING_TO_SHOW:
            return {...state, drawingToShow: action.drawing, error:''};
        default:
            return state
    }

}