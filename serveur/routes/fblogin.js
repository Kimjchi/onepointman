const axios = require('axios');
const express = require('express');
const router = express.Router();
const querystring = require('querystring');
const facebookdata = require("../facebookdata");

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

const _checkIfUserExists = () => {

};

router.get('/', function (req, res, next) {
    console.log("GET /fblogin");

    let facebookURI = {
        redirectURI: 'https://www.facebook.com/v2.11/dialog/oauth?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth'
    };

    _sendResponse(SUCCESS_STATUS, facebookURI, res)

    console.log("end GET /fblogin");
});

router.get('/handleauth', function (req, res, next) {
    console.log("GET /fblogin/handleauth");

    let str = querystring.parse(req.originalUrl.substring(req.originalUrl.indexOf("?") + 1, req.originalUrl.length));

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

                            //TODO: Send response to client
                            _sendResponse(SUCCESS_STATUS, 'Welcome on Onepointman, man !', res)
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

module.exports = router;