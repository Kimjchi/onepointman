import {
    CHANGE_FORM,
    SET_AUTH,
    SENDING_REQUEST,
    LOGIN
}  from '../actions/opLogin';
import {ADD_GROUP} from "../actions/opGroups";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    formState:{
        username:'',
        password: '',
        email:''
    },
    groupes: [
        {
            nom: 'Groupe 1'
        },
        {
            nom: 'Groupe 2'
        },
        {
            nom: 'Groupe 3'
        },
        {
            nom: 'Groupe 4'
        }
    ],
    errors: '',
    isLoading: false,
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case CHANGE_FORM:
            return {...state ,formState: action.newFormState , error:''};
        case ADD_GROUP:
            return {...state ,groupes: action.arrayGroups , error:''};
        default:
            return state

    }

}