import {

}  from '../actions/opMap';
import {CHANGE_FORM, LOGIN} from "../actions/opLogin";
import {CHANGE_MAP_CENTER} from "../actions/opMap";
import {CHANGE_MARKERS} from "../actions/opMap";
import {CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";
import {CHANGE_MARKERS_SELECT} from "../actions/opMap";
import {CHANGE_PINPOINTS} from "../actions/opMap";
import {CHANGE_LOCATION_SELECT} from "../actions/opMap";
import {CHANGE_MARKER_SELECT} from "../actions/opMap";
import {CHANGE_NEW_PINPOINT} from "../actions/opOptions";
import {CHANGE_MAP} from "../actions/opMap";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    isMarkerShown : true,
    mapCenter : { lat: -34.397, lng: 150.644 },
    zoom : 3,
    markerSelect : { lat: -34.397, lng: 150.644},
    locationSelect : "",
    pinPoints : [],
    markersGeoLocation : [],
    map : null
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case CHANGE_MAP_CENTER:
            return {...state , mapCenter: action.mapCenter, zoom : action.zoom};

        case CHANGE_LOCATION_SELECT:
            return {...state , locationSelect: action.locationSelect};
        case CHANGE_MARKER_SELECT:
            return {...state , markerSelect: action.marker};

        case CHANGE_MARKER_GEOLOCATION:
            return {...state, markersGeoLocation : action.markers};

        case CHANGE_PINPOINTS:
            return {...state, pinPoints : action.pinPoints};

        case CHANGE_MAP:
            return {...state, map : action.map};

        default:
            return state

    }

}