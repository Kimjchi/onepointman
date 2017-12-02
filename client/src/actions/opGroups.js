export const CHANGE_NOM_GROUPE = 'CHANGE_NOM_GROUPE';
export const ADD_GROUP = 'ADD_GROUP';

export function changeNomGroupe (nomGroupe){
    return {type: CHANGE_NOM_GROUPE, nomGroupe}
}

export function addGroup (arrayGroups){
    return {type: ADD_GROUP, arrayGroups}
}