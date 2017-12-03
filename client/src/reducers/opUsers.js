
//ajouter le reste dans l'import

//pour le register e mail
import {ADD_USER, CHANGE_GROUP_DISPLAY, CHANGE_SEARCH} from "../actions/opUsers";

let initialState = {
    users: [],
    groupToDisplay: '',
    search: '',
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
        case CHANGE_SEARCH:
            return {...state ,search: action.newSearch , error:''};
        default:
            return state

    }

}