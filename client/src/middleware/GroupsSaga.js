import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {ADD_GROUP_TEST, changeGroups, GET_GROUPS, GET_PHOTO, getGroups, getPhoto, setPhoto} from "../actions/opGroups";
import {changeUsers} from "../actions/opUsers";

export function * requestGroups() {
    while (true) {
        let user = yield take(GET_GROUPS);
        let id = user.idUser;

        let server = "http://localhost:3001/groups/"+id;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    let groups = response.data.message;
                    store.dispatch(changeGroups(groups));
                    let users = [];
                    groups.forEach(group => {
                        group.membres.forEach(membre => {
                            let duplicate = false;
                            users.forEach(user => {
                                if(user.iduser === membre.iduser) {
                                    duplicate = true;
                                }
                            });
                            if(!duplicate) {
                                users.push(membre);
                            }
                        })
                    });
                    store.dispatch(changeUsers(users));
                    groups.forEach(group => {
                        group.membres.forEach(membre => {
                            store.dispatch(getPhoto(membre.iduser))
                        })
                    })
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la récupération des groupes d\'un utilisateur');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestAddGroup() {
    while (true) {
        let user = yield take(ADD_GROUP_TEST);
        let id = user.idUser;
        let groupName = user.groupName;

        let server = "http://localhost:3001/groups/create";

        axios.post(server, {
            id: id,
            groupName: groupName
        })
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    alert('La création du groupe est un succès !');
                    store.dispatch(getGroups(id));
                }
                else if(response.data.status === 'fail') {
                    alert(response.data.message);
                }
                else {
                    alert('Erreur lors de la création d\'un groupe');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function * requestPhoto() {
    while (true) {
        let user = yield take(GET_PHOTO);
        let id = user.idUser;

        let server = "https://graph.facebook.com/"+id+"/picture?redirect=false&type=normal";

        axios.get(server)
            .then(function (response) {
                if(!!response.status && response.status === 200) {
                    store.dispatch(setPhoto(id, response.data.data.url));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function * GroupsFlow() {
    yield fork(requestGroups);
    yield fork(requestAddGroup);
    yield fork(requestPhoto);
}