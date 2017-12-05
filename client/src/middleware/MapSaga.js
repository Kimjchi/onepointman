import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {LOGIN_REQUEST} from "../actions/opLogin";
import {CHANGE_MAP_CENTER, CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";


export function* transmitPosition() {

    while (true) {
        let position = yield take(CHANGE_MARKER_GEOLOCATION);
        console.log(position);
        /*let server = "http://localhost:3001/position";
        let data : { userId : "Looool",
                    position : position
                    };
        axios.post(server, {
            headers: {
                'Content-Type': 'application/json',
                'Content-Encoding': 'gzip'
            },
            data : JSON.stringify(data))
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });*/
    }
}

export function* MapFlow() {
    yield fork(transmitPosition);
}