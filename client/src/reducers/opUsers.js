
//ajouter le reste dans l'import

//pour le register e mail
import {ADD_USER, CHANGE_FRIENDS, CHANGE_SEARCH, CHANGE_USERS, DELETE_USER} from "../actions/opUsers";

let initialState = {
    users: [],
    groupToDisplay: '',
    search: '',
    usersToDelete: [],
    friends: [],
    errors: '',
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case ADD_USER:
            return {...state ,users: action.arrayUsers , error:'', groupToDisplay: action.idGroup};
        case DELETE_USER:
            return {...state ,usersToDelete: action.arrayUsers , error:''};
        case CHANGE_SEARCH:
            return {...state ,search: action.newSearch , error:''};
        case CHANGE_USERS:
            return {...state,users: action.users, error: ''};
        case CHANGE_FRIENDS:
            return {...state,friends: action.friends, error: ''};
        default:
            return state

    }

}