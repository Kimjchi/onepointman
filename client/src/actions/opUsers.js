export const ADD_USER = 'ADD_USER';
export const CHANGE_SEARCH = 'CHANGE_SEARCH';
export const DELETE_USER = 'DELETE_USER';
export const GET_USERS = 'GET_USERS';
export const CHANGE_USERS = 'CHANGE_USERS';
export const ADD_USER_TEST = 'ADD_USER_TEST';
export const DELETE_USER_TEST = 'DELETE_USER_TEST';
export const GET_FRIENDS = 'GET_FRIENDS';
export const CHANGE_FRIENDS = 'CHANGE_FRIENDS';

export function addUser (arrayUsers, idGroup){
    return {type: ADD_USER, arrayUsers, idGroup}
}

export function changeSearch(newSearch) {
    return {type: CHANGE_SEARCH, newSearch}
}

export function deleteUser (arrayUsers, idGroup) {
    return {type: DELETE_USER, arrayUsers, idGroup}
}

export function getUsers(idGroup, idUser) {
    return {type: GET_USERS, idGroup, idUser}
}

export function changeUsers(users) {
    return {type: CHANGE_USERS, users}
}

export function addUserTest(users, idGroup, idUser) {
    return {type: ADD_USER_TEST, users, idGroup, idUser}
}

export function deleteUserTest(idUser, idGroup) {
    return {type: DELETE_USER_TEST, idUser, idGroup}
}

export function getFriends(idUser) {
    return {type: GET_FRIENDS, idUser}
}

export function changeFriends(friends) {
    return {type: CHANGE_FRIENDS, friends}
}