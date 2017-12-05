import {all} from 'redux-saga/effects';
import {LoginFlow} from "./LoginSaga";
import {MapFlow} from "./MapSaga";

export default function * root(){

    yield all ([LoginFlow(), MapFlow()])
}
