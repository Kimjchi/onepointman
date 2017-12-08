'use strict';

var express = require('express');
var router = express.Router();
var axios = require('axios');

var sender = require('../sender');
var facebookdata = require("../facebookdata");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource user id :' + facebookdata.userAccessToken);
});

router.get('/userFriends/:user_id/', function (req, res) {
    console.log("GET /userFriends/:iuser_id/");

    var user_id = req.params.user_id;
    var userFriendList = void 0;

    _getUserFriendList(user_id).then(function (response) {
        userFriendList = response.data.data;

        console.log(userFriendList);

        //TODO: Send response to client
        sender.sendResponse(sender.SUCCESS_STATUS, userFriendList, res);
    }).catch(function (error) {
        console.log(error);
    });
});

var _getUserFriendList = function _getUserFriendList(user_id) {
    var userFriendListRequest = {
        redirectURI: 'https://graph.facebook.com/v2.11/',
        userAccessToken: facebookdata.userAccessToken,
        userID: user_id
    };

    return axios.get(userFriendListRequest.redirectURI + userFriendListRequest.userID + '/friends?access_token=' + userFriendListRequest.userAccessToken);
};

module.exports = router;
//# sourceMappingURL=users.js.map