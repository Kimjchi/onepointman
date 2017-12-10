import {DRAW} from "../actions/opCanvas";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    errors: '',
    draw: false,
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case DRAW:
            return {...state , draw: action.boolean, error:''};
        default:
            return state
    }

}