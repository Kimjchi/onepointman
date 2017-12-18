import {all} from 'redux-saga/effects';
import {LoginFlow} from "./LoginSaga";
import {MapFlow} from "./MapSaga";
import {HandleAuthFlow} from "./HandleAuthSaga";
import {GroupsFlow} from "./GroupsSaga";
import {UsersFlow} from "./UsersSaga";
import {OptionsFlow} from "./OptionsSaga";
import {CanvasFlow} from "./CanvasSaga";
import openSocket from 'socket.io-client';


//TODO: establish websocket connection
const socket = openSocket('http://localhost:3002');

socket.on('Notification', (data) => {
    //alert(data);
    notify(data);
    //nm.info(data, 'Success');
});

function notify(message) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(message);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(message);
            }
        });
    }

    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

export default function * root() {

    yield all([LoginFlow(socket), HandleAuthFlow(socket), MapFlow(socket), GroupsFlow(socket),
                UsersFlow(socket), OptionsFlow(socket), CanvasFlow(socket)]);

}
