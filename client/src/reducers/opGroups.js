import {ADD_GROUP, CHANGE_GROUP_NAME, CHANGE_GROUPS} from "../actions/opGroups";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    groupName: '',
    groups: [
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

        case CHANGE_GROUP_NAME:
            return {...state ,groupName: action.groupName , error:''};
        case ADD_GROUP:
            return {...state ,groups: action.arrayGroups , error:'', groupName: ''};
        case CHANGE_GROUPS:
            return {...state, groups: action.groups, error:''};
        default:
            return state

    }

}