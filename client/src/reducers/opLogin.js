import {
    CHANGE_FORM,
    SET_AUTH,
    SENDING_REQUEST,
    LOGIN
}  from '../actions/opLogin';

//ajouter le reste dans l'import

//pour le register e mail
let initialState = {
    formState:{
        username:'',
        password: '',
        email:''
    },
    errors: '',
    sending:'',
    isLoading: false,
    loggedIn: false,
    isAdmin: false,
    cookie:''
};

export default function reducer (state = initialState, action ){

    switch (action.type){

        case CHANGE_FORM:
            return {...state ,formState: action.newFormState , error:''};

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