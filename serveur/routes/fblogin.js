const axios = require('axios');
const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const facebookdata = require("../facebookdata");


const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const SUCCESS_STATUS = 200;
const REDIRECT_STATUS = 304;
const NOT_FOUND_STATUS = 404;

let userFriendList;

const _sendResponse = (status, message, res) => {
    res.status(status);
    res.send(message);
};

const _getUserAccessToken = (str) => {
    let requestToken = {
        redirectURI: 'https://graph.facebook.com/v2.11/oauth/access_token?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth',
        client_secret: '8120bf1c2ce2729a20d024a8c491c9b5',
        code: str.code
    };

    return axios.get(requestToken.redirectURI + 'client_id=' + requestToken.client_id + '&redirect_uri=' + requestToken.redirect_uri
        + '&client_secret=' + requestToken.client_secret + '&code=' + requestToken.code)
};

const _getAppAccessToken = () => {

    const apiAppRequest = {
        requestAPI: 'https://graph.facebook.com/oauth/access_token?',
        client_id: '137357800216709',
        client_secret: '8120bf1c2ce2729a20d024a8c491c9b5',
        grant_type: 'client_credentials'
    };

    return axios.get(apiAppRequest.requestAPI + 'client_id=' + apiAppRequest.client_id + '&client_secret='
        + apiAppRequest.client_secret + '&grant_type=' + apiAppRequest.grant_type)
};

const _inspectUserToken = () => {
    let inspectTokenRequest = {
        redirectURI: 'https://graph.facebook.com/debug_token?',
        input_token: facebookdata.userAccessToken,
        access_token: facebookdata.appAccessToken
    };

    return axios.get(inspectTokenRequest.redirectURI + 'input_token=' + inspectTokenRequest.input_token + '&access_token=' + inspectTokenRequest.access_token)
};

const _checkIfUserExists = (user_id) => {
    return db.query(squel
        .select()
        .from('"USER"')
        .where('iduser = ?', user_id)
        .toString())
};

const _insertNewUser = (user_id, userlastname, userfirstname) => {
    return db.query(squel
        .insert()
        .into('"USER"')
        .set('iduser', user_id)
        .set('nom', userlastname)
        .set('prenom', userfirstname)
        .toString())
};

const _getUserDataFromFb = (user_id) => {
    let userData = {
        uri: 'https://graph.facebook.com/v2.11/',
        user_id: user_id,
        access_token: facebookdata.userAccessToken
    };

    return axios.get(userData.uri + userData.user_id + '?access_token=' + userData.access_token + '&fields=id,last_name,first_name,gender,picture');
};

router.get('/', function (req, res, next) {
    console.log("GET /fblogin");

    let facebookURI = {
        redirectURI: 'https://www.facebook.com/v2.11/dialog/oauth?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth',
        scope: 'email,user_friends'
    };

    _sendResponse(SUCCESS_STATUS, facebookURI, res)

    console.log("end GET /fblogin");
});

router.get('/handleauth', function (req, res, next) {
    console.log("GET /fblogin/handleauth");

    let str = querystring.parse(req.originalUrl.substring(req.originalUrl.indexOf("?") + 1, req.originalUrl.length));
    let loggedUser = {
        nom: '',
        prenom: '',
        iduser: '',
        photo: ''
    };

    console.log('STR VALUE :' + str.code);

    _getUserAccessToken(str)
        .then(response => {

            facebookdata.userAccessToken = response.data.access_token;

            _getAppAccessToken()
                .then(response => {

                    facebookdata.appAccessToken = response.data.access_token;

                    _inspectUserToken()
                        .then(response => {
                            facebookdata.userFbId = response.data.data.user_id;

                            _getUserDataFromFb(facebookdata.userFbId)
                                .then(response => {
                                    loggedUser.prenom = response.data.first_name;
                                    loggedUser.nom = response.data.last_name;
                                    loggedUser.photo = response.data.picture;
                                    loggedUser.iduser = facebookdata.userFbId
                                })
                                .catch(error => {
                                    console.log(error);
                                });

                            _checkIfUserExists(facebookdata.userFbId)
                                .then(existingUser => {

                                    if (existingUser.length === 0) {
                                        console.log('User does not exist. Creating user with facebook ID : ' + facebookdata.userFbId);

                                        _insertNewUser(facebookdata.userFbId, loggedUser.nom, loggedUser.prenom);

                                        _sendResponse(SUCCESS_STATUS, loggedUser, res);
                                    } else {
                                        console.log('User with ID : ' + facebookdata.userFbId + 'already exists in database');

                                        _sendResponse(SUCCESS_STATUS, loggedUser, res);
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        })
                        .catch(error => {
                            console.log(error);
                        });
                })
                .catch(error => {
                    console.log(error)
                });
        })
        .catch(error => {
            console.log(error)
        });

    console.log("end GET /fblogin/handleauth");
});

router.post('/authAndroid', function (req, res) {

    //TODO : bind user access token to facebokdata


    //TODO : get app access token

    //TODO : sendResponse to android client
});
module.exports = router;