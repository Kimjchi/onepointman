import {

}  from '../actions/opOptions';
import {CHANGE_ADRESS} from "../actions/opOptions";
import {CHANGE_ADDRESS} from "../actions/opOptions";
import {CHANGE_ADDRESS_FORMATTED} from "../actions/opOptions";
import {CHANGE_ADDRESS_ENTRY} from "../actions/opOptions";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    address : ""
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case CHANGE_ADDRESS:
            return {...state , address : action.newAddress};

        default:
            return state

    }

}