import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";

export function* transmitPosition() {

    while (true) {
        let position = yield take(CHANGE_MARKER_GEOLOCATION);
        console.log(position);
        let server = "http://localhost:3001/users/updateposition/:iduser/" + position.lat + "/" + position.lng;
        /*axios.get(server, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            }})
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });*/
    }
}

export function* OptionsFlow() {
    yield fork(transmitPosition);
}