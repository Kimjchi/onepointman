import {

}  from '../actions/opMap';
import {CHANGE_FORM, LOGIN} from "../actions/opLogin";
import {CHANGE_MAP_CENTER} from "../actions/opMap";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    isMarkerShown : true,
    mapCenter : { lat: -34.397, lng: 150.644 },
    zoom : 3
};

export default function reducer (state = initialState, action ){

    switch (action.type){


        case CHANGE_MAP_CENTER:
            return {...state , mapCenter: action.mapCenter, zoom : action.zoom};

        default:
            return state

    }

}