import {take, fork} from 'redux-saga/effects';
import axios from 'axios';
import {HANDLE_AUTH_REQ} from "../actions/opHandleAuth";
import {store} from '../store';
import {getPhotoUser, idUser, setAuthState} from "../actions/opLogin";
import {push} from "react-router-redux";
import {bindDrawingsGroup, GET_DRAWINGS_GROUP, SEND_DRAWING} from "../actions/opCanvas";

export function* requestSendDrawing() {

    while (true) {

        let drawing = yield take(SEND_DRAWING);

        let draw = drawing.drawing;
        let idUser = drawing.idUser;
        let idGroup = drawing.idGroup;
        let description = drawing.description;
        let zoom = drawing.zoom;
        let center = drawing.center;

        console.log(drawing);

        let server = "http://localhost:3001/drawing/createdrawing";

        axios.post(server, {
            iduser: idUser,
            idgroup: idGroup,
            description: description,
            zoom: zoom,
            lt: center.lat,
            lg: center.lng,
            img:draw,

    })
            .then(function (response) {
                if(!!response.status && response.status === 200) {
                    console.log(response.data.iddrawing);
                    //store.dispatch(setPhoto(id, response.data.data.url));
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function* requestGetDrawings() {

    while (true) {

        let drawing = yield take(GET_DRAWINGS_GROUP);

        let idUser = drawing.idUser;
        let idGroup = drawing.idGroup;
        console.log(idUser);
        console.log("YOOOOOO");
        let server = "http://localhost:3001/groups/drawings/"+idUser+"/"+idGroup;

        axios.get(server)
            .then(function (response) {
                if(!!response.data.status && response.data.status === 'success') {
                    if(response.data.message.drawings.length !== 0) {
                        store.dispatch(bindDrawingsGroup(response.data.message.drawings));
                    }
                    else {
                        store.dispatch(bindDrawingsGroup([]));
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }
}

export function* CanvasFlow() {
    yield fork(requestSendDrawing);
    yield fork(requestGetDrawings);
}
