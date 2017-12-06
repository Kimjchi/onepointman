import {ADD_GROUP, CHANGE_NOM_GROUPE} from "../actions/opGroups";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    nomGroupe: '',
    groupes: [
        {
            id: 1,
            nom: 'Heya'
        },
        {
            id: 2,
            nom: 'BROOOS'
        },
        {
            id: 3,
            nom: 'Yeee'
        },
        {
            id: 4,
            nom: 'Groupe 4'
        }
    ],
    errors: '',
    isLoading: false,
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case CHANGE_NOM_GROUPE:
            return {...state ,nomGroupe: action.nomGroupe , error:''};
        case ADD_GROUP:
            return {...state ,groupes: action.arrayGroups , error:'', nomGroupe: ''};
        default:
            return state

    }

}