var express = require('express');
var router = express.Router();
const axios = require('axios');

const sender = require('../sender');
const facebookdata = require("../facebookdata");

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource user id :' + facebookdata.userAccessToken);
});

router.get('/userFriends/:user_id/', function(req, res) {
    console.log("GET /userFriends/:iuser_id/");

    let user_id = req.params.user_id;
    let userFriendList;

    _getUserFriendList(user_id)
        .then(response => {
            userFriendList = response.data.data;

            console.log(userFriendList);

            //TODO: Send response to client
            sender.sendResponse(sender.SUCCESS_STATUS, userFriendList, res)
        })
        .catch(error => {
            console.log(error)
        });
});

const _getUserFriendList = (user_id) => {
    let userFriendListRequest = {
        redirectURI: 'https://graph.facebook.com/v2.11/',
        userAccessToken: facebookdata.userAccessToken,
        userID: user_id
    }

    return axios.get(userFriendListRequest.redirectURI + userFriendListRequest.userID + '/friends?access_token=' + userFriendListRequest.userAccessToken)
};

module.exports = router;
