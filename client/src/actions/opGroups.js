export const CHANGE_FORM_GROUPS = 'CHANGE_FORM_GROUPS';
export const ADD_GROUP = 'ADD_GROUP';

export function changeFormGroups (newFormState){
    return {type: CHANGE_FORM_GROUPS, newFormState}
}

export function addGroup (arrayGroups){
    return {type: ADD_GROUP, arrayGroups}
}