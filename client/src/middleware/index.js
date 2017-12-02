import {all} from 'redux-saga/effects';
import {LoginFlow} from "./LoginSaga";

export default function * root(){

    yield all ([LoginFlow()])
}
