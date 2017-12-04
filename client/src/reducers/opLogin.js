import {
    CHANGE_FORM,
    SET_AUTH,
    SENDING_REQUEST,
    LOGIN
}  from '../actions/opLogin';

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    errors: '',
    sending:'',
    isLoading: false,
    loggedIn: false,
    idUser: '',
    cookie:''
};

export default function reducer (state = initialState, action ){

    switch (action.type){
        case LOGIN:
            return {...state , isAdmin: action.isAdminState._auth.isAdmin ,cookie: action.isAdminState._auth.cookie, error:''};
        case SET_AUTH:
            return {...state, loggedIn: action.newAuthState, error:''};
        case SENDING_REQUEST:
            return {...state, loggedIn: action.sending, error:''};
        default:
            return state

    }

}