import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {LOGIN_REQUEST} from "../actions/opLogin";
import {push} from "react-router-redux";

export function* requestLoginBack() {

    while (true) {

        yield take(LOGIN_REQUEST);

        let server = "http://localhost:3001/fblogin";

        axios.get(server)
            .then(function (response) {
                console.log(response);
                if (!!response.status && response.status === 200) {
                    //store.dispatch()
                    window.location.href = response.data.redirectURI + 'client_id=' + response.data.client_id + '&redirect_uri=' + response.data.redirect_uri;
                } else {
                    alert('Erreur lors du Login');
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

export function* LoginFlow() {
    yield fork(requestLoginBack);
}
