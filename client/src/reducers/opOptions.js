import {

}  from '../actions/opOptions';
import {CHANGE_ADRESS} from "../actions/opOptions";
import {CHANGE_ADDRESS} from "../actions/opOptions";
import {CHANGE_ADDRESS_FORMATTED} from "../actions/opOptions";
import {CHANGE_ADDRESS_ENTRY} from "../actions/opOptions";
import {CHANGE_SHARING_MODE} from "../actions/opOptions";
import {CHANGE_RDV_MODAL_VISIBILITY} from "../actions/opOptions";
import {CHANGE_NEW_PINPOINT} from "../actions/opOptions";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    address : "",
    validAddress : false,
    isSharingPosition : false,
    showModalRdv : false,
    pinPoint : {
        date : "",
        desc : ""
    }
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case CHANGE_ADDRESS:
            return {...state , address : action.newAddress, validAddress : action.validAddress};
        case CHANGE_SHARING_MODE:
            return {...state, isSharingPosition : !state.isSharingPosition};
        case CHANGE_RDV_MODAL_VISIBILITY:
            return {...state, showModalRdv : !state.showModalRdv};
        case CHANGE_NEW_PINPOINT:
            return {...state, pinPoint : action.pinPoint};

        default:
            return state

    }

}