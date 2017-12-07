'use strict';

var axios = require('axios');
var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var facebookdata = require("../facebookdata");

var SUCCESS_STATUS = 200;
var REDIRECT_STATUS = 304;
var NOT_FOUND_STATUS = 404;

var userFriendList = void 0;

var _sendResponse = function _sendResponse(status, message, res) {
    res.status(status);
    res.send(message);
};

var _getUserAccessToken = function _getUserAccessToken(str) {
    var requestToken = {
        redirectURI: 'https://graph.facebook.com/v2.11/oauth/access_token?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth',
        client_secret: '8120bf1c2ce2729a20d024a8c491c9b5',
        code: str.code
    };

    return axios.get(requestToken.redirectURI + 'client_id=' + requestToken.client_id + '&redirect_uri=' + requestToken.redirect_uri + '&client_secret=' + requestToken.client_secret + '&code=' + requestToken.code);
};

var _getAppAccessToken = function _getAppAccessToken() {

    var apiAppRequest = {
        requestAPI: 'https://graph.facebook.com/oauth/access_token?',
        client_id: '137357800216709',
        client_secret: '8120bf1c2ce2729a20d024a8c491c9b5',
        grant_type: 'client_credentials'
    };

    return axios.get(apiAppRequest.requestAPI + 'client_id=' + apiAppRequest.client_id + '&client_secret=' + apiAppRequest.client_secret + '&grant_type=' + apiAppRequest.grant_type);
};

var _inspectUserToken = function _inspectUserToken() {
    var inspectTokenRequest = {
        redirectURI: 'https://graph.facebook.com/debug_token?',
        input_token: facebookdata.userAccessToken,
        access_token: facebookdata.appAccessToken
    };

    return axios.get(inspectTokenRequest.redirectURI + 'input_token=' + inspectTokenRequest.input_token + '&access_token=' + inspectTokenRequest.access_token);
};

var _checkIfUserExists = function _checkIfUserExists() {};

router.get('/', function (req, res, next) {
    console.log("GET /fblogin");

    var facebookURI = {
        redirectURI: 'https://www.facebook.com/v2.11/dialog/oauth?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/handleauth'
    };

    _sendResponse(SUCCESS_STATUS, facebookURI, res);

    console.log("end GET /fblogin");
});

router.get('/handleauth', function (req, res, next) {
    console.log("GET /fblogin/handleauth");

    var str = querystring.parse(req.originalUrl.substring(req.originalUrl.indexOf("?") + 1, req.originalUrl.length));

    console.log('STR VALUE :' + str.code);

    _getUserAccessToken(str).then(function (response) {

        facebookdata.userAccessToken = response.data.access_token;

        _getAppAccessToken().then(function (response) {

            facebookdata.appAccessToken = response.data.access_token;

            _inspectUserToken().then(function (response) {
                facebookdata.userFbId = response.data.data.user_id;

                //TODO: Send response to client
                _sendResponse(SUCCESS_STATUS, 'Welcome on Onepointman, man !', res);
            }).catch(function (error) {
                console.log(error);
            });
        }).catch(function (error) {
            console.log(error);
        });
    }).catch(function (error) {
        console.log(error);
    });

    console.log("end GET /fblogin/handleauth");
});

module.exports = router;
//# sourceMappingURL=fblogin.js.map