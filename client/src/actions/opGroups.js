export const CHANGE_NOM_GROUPE = 'CHANGE_NOM_GROUPE';
export const ADD_GROUP = 'ADD_GROUP';
export const GET_GROUPS = 'GET_GROUPS';

export function changeNomGroupe (nomGroupe){
    return {type: CHANGE_NOM_GROUPE, nomGroupe}
}

export function addGroup (arrayGroups, idUser){
    return {type: ADD_GROUP, arrayGroups, idUser}
}

export function getGroups(idUser) {
    return {type: GET_GROUPS, idUser}
}

