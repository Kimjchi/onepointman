import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {store} from '../store';
import {CHANGE_MARKER_GEOLOCATION} from "../actions/opMap";
import {CREATE_PINPOINT} from "../actions/opOptions";
import {setPhotoUser} from "../actions/opLogin";
import {getInfosGroup} from "../actions/opGroups";

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

export function* createPinPoint() {

    while (true) {
        let pinPointArgs = yield take(CREATE_PINPOINT);
        let pinPoint = pinPointArgs.pinPoint;
        let userId = pinPointArgs.userId;
        let groupId = pinPointArgs.groupId;
        console.log(pinPoint);
        console.log(userId);
        console.log(groupId);
        let server = "http://localhost:3001/pinpoint/createpinpoint";
        axios.post(server, pinPoint, {
            headers: {
                'Content-Type': 'application/json'
            }})
        .then(function (response) {
            console.log(response);
            if(response.status === 200) {
                store.dispatch(getInfosGroup(userId, groupId));
            } else {
                console.log(response.status);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
}


export function* OptionsFlow() {
    yield fork(transmitPosition);
    yield fork(createPinPoint);
}