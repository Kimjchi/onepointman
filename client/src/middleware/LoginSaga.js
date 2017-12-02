import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {LOGIN_REQUEST} from "../actions/opLogin";

export function* requestLoginBack() {

    while (true) {

        yield take(LOGIN_REQUEST);

        let server = "http://localhost:3002/";
        console.log("Helllo");
        /*axios.get(server)
            .then(function (response) {
                if (!!response.data.status && response.data.status === "success") {
                    //store.dispatch()
                } else {
                    alert('Erreur lors du Login');
                }
            })
            .catch(function (error) {
                console.log(error);
            });*/
    }
}


export function* LoginFlow() {
    yield fork(requestLoginBack);
}
