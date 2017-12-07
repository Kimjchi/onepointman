export const CHANGE_GROUP_NAME = 'CHANGE_GROUP_NAME';
export const ADD_GROUP = 'ADD_GROUP';
export const GET_GROUPS = 'GET_GROUPS';
export const CHANGE_GROUPS = 'CHANGE_GROUPS';
export const ADD_GROUP_TEST = 'ADD_GROUP_TEST';

export function changeGroupName (groupName){
    return {type: CHANGE_GROUP_NAME, groupName}
}

export function addGroup (arrayGroups, idUser){
    return {type: ADD_GROUP, arrayGroups, idUser}
}

export function getGroups(idUser) {
    return {type: GET_GROUPS, idUser}
}

export function changeGroups(groups) {
    return {type: CHANGE_GROUPS, groups}
}

export function addGroupTest(groupName, idUser) {
    return {type: ADD_GROUP_TEST, groupName, idUser}
}