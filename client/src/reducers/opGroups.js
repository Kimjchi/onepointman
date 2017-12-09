import {ADD_GROUP, CHANGE_GROUP_NAME, CHANGE_GROUPS, SET_PHOTO} from "../actions/opGroups";

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    groupName: '',
    groups: [],
    errors: '',
    isLoading: false,
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case CHANGE_GROUP_NAME:
            return {...state ,groupName: action.groupName , error:''};
        case CHANGE_GROUPS:
            return {...state, groups: action.groups, error:''};
        case SET_PHOTO:
            let id = action.idUser;
            let groups = state.groups;
            groups.forEach(group => {
                group.membres.forEach(membre => {
                    if(membre.iduser === id) {
                        membre.urlPhoto = action.url;
                    }
                });
            });
            return {...state, groups: groups, error: ''};
        default:
            return state

    }

}