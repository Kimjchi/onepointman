import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {HANDLE_AUTH_REQ} from "../actions/opHandleAuth";
import {store} from '../store';
import {idUser, setAuthState} from "../actions/opLogin";
import {push} from "react-router-redux";

export function* HandleAuth() {

    while (true) {

        yield take(HANDLE_AUTH_REQ);

        let server = "http://localhost:3001/fblogin/handleauth?";

        console.log('Trying to reach URL : ' + server + window.location.href.substring(window.location.href.indexOf("?") + 1, window.location.href.length));

        axios.get(server + window.location.href.substring(window.location.href.indexOf("?") + 1, window.location.href.length))
            .then(function (response) {
                if (!!response.status && response.status === 200) {
                    alert('Welcome ' + JSON.stringify(response.data.prenom));
                    store.dispatch(setAuthState(true));
                    store.dispatch(push("/Home"));
                } else {
                    alert('auth error');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function* HandleAuthFlow() {
    yield fork(HandleAuth);
}
