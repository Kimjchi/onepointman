export const ADD_USER = 'ADD_USER';
export const CHANGE_SEARCH = 'CHANGE_SEARCH';
export const DELETE_USER = 'DELETE_USER';

export function addUser (arrayUsers, idGroup){
    return {type: ADD_USER, arrayUsers, idGroup}
}

export function changeSearch(newSearch) {
    return {type: CHANGE_SEARCH, newSearch}
}

export function deleteUser (arrayUsers, idGroup) {
    return {type: DELETE_USER, arrayUsers, idGroup}
}
