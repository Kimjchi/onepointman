import {all} from 'redux-saga/effects';
import {LoginFlow} from "./LoginSaga";
import {MapFlow} from "./MapSaga";
import {HandleAuthFlow} from "./HandleAuthSaga";

export default function * root(){

    yield all ([LoginFlow(), HandleAuthFlow(), MapFlow()])
}
