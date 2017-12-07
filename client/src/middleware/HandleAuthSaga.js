import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {HANDLE_AUTH_REQ} from "../actions/opHandleAuth";


export function* HandleAuth() {

    while (true) {

        yield take(HANDLE_AUTH_REQ);

        let server = "http://localhost:3001/fblogin/handleauth?";

        console.log('Trying to reach URL : ' + server + window.location.href.substring(window.location.href.indexOf("?") + 1, window.location.href.length));

        axios.get(server + window.location.href.substring(window.location.href.indexOf("?") + 1, window.location.href.length))
            .then(function (response) {
                console.log(response);
                if (!!response.status && response.status === 200) {
                    alert('liste d\'amis : ' + JSON.stringify(response.data));
                    window.location.href = 'http://localhost:3000/Home';

                    response.data.status === 'success' && response.status ===  200
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
