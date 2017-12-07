import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {ADD_GROUP_TEST, changeGroups, GET_GROUPS, getGroups} from "../actions/opGroups";

export function * requestGroups() {
    while (true) {
        let user = yield take(GET_GROUPS);
        let id = user.idUser;

        let server = "http://localhost:3001/groups/"+id;

        axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === 'success') {
                    store.dispatch(changeGroups(response.data.message));
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


export function * GroupsFlow() {
    yield fork(requestGroups);
    yield fork(requestAddGroup);
}