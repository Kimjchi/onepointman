
//ajouter le reste dans l'import

//pour le register e mail
import {ADD_USER, CHANGE_SEARCH, DELETE_USER} from "../actions/opUsers";

let initialState = {
    users: [],
    groupToDisplay: '',
    search: '',
    usersToDelete: [],
    groupesUsers: [
        {
            id: 1,
            nom: 'Groupe 1',
            users: [
                {
                    nom: 'Joe Lie'
                },
                {
                    nom: 'Broo te'
                }
            ]
        },
        {
            id: 2,
            nom: 'Babes',
            users: [
                {
                    nom: 'Devon Brunet'
                },
                {
                    nom: 'Jérémy Kim'
                },
                {
                    nom: 'Babe'
                }
            ]
        }
    ],
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
        default:
            return state

    }

}