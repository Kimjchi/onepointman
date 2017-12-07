import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {
    ADD_USER_TEST, changeFriends, changeUsers, DELETE_USER_TEST, GET_FRIENDS, GET_USERS,
    getUsers
} from "../actions/opUsers";

export function * requestUsersGroup() {
    while (true) {
        let user = yield take(GET_USERS);
        let id = user.idUser;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/"+idGroup+"/"+id;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    store.dispatch(changeUsers(response.data.message));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la récupération des utilisateurs d\'un groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestAddUsers() {
    while (true) {
        let user = yield take(ADD_USER_TEST);
        let id = user.idUser;
        let idusers = user.users;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/groups/addUser";

        axios.post(server, {
            users: idusers,
            idGroup: idGroup
        })
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    alert('L\'ajout d\'un membre au groupe est un succès !');
                    store.dispatch(getUsers(idGroup, id));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de l\'ajout d\'un membre au groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestDeleteUser() {
    while (true) {
        let user = yield take(DELETE_USER_TEST);
        let id = user.idUser;
        let idGroup = user.idGroup;

        let server = "http://localhost:3001/"+idGroup+"/"+id;

        axios.delete(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    alert('La suppression d\'un membre du groupe est un succès !');
                    store.dispatch(getUsers(idGroup, id));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la suppression d\'un membre au groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestFriends() {
    while (true) {
        let user = yield take(GET_FRIENDS);
        let id = user.idUser;

        let server = "http://localhost:3001/friends/"+id;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    alert('La récupération des amis est un succès !');
                    store.dispatch(changeFriends(response.data.message));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la récupération des amis');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}


export function * UsersFlow() {
    yield fork(requestUsersGroup);
    yield fork(requestAddUsers);
    yield fork(requestDeleteUser);
    yield fork(requestFriends);
}