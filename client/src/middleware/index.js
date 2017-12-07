import {all} from 'redux-saga/effects';
import {LoginFlow} from "./LoginSaga";
import {MapFlow} from "./MapSaga";
import {HandleAuthFlow} from "./HandleAuthSaga";
import {GroupsFlow} from "./GroupsSaga";
import {UsersFlow} from "./UsersSaga";

export default function * root() {

    yield all([LoginFlow(), HandleAuthFlow(), MapFlow(), GroupsFlow(), UsersFlow()]);

}
