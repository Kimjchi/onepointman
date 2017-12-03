export const ADD_USER = 'ADD_USER';
export const CHANGE_SEARCH = 'CHANGE_SEARCH';

export function addUser (arrayUsers, idGroup){
    return {type: ADD_USER, arrayUsers, idGroup}
}

export function changeSearch(newSearch) {
    return {type: CHANGE_SEARCH, newSearch}
}