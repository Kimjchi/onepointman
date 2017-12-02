'use strict';

var express = require('express');
var router = express.Router();

var SUCCESS_STATUS = 200;
var NOT_FOUND_STATUS = 404;

var _sendRepsonse = function _sendRepsonse(status, message, res) {
    res.status(status);
    res.send(message);
};

/* GET users listing. */
router.get('/', function (req, res, next) {
    console.log("GET /fblogin");

    var facebookURI = {
        redirectURI: 'https://www.facebook.com/v2.11/dialog/oauth?\n' + '  client_id=onepointman\n' + '  &redirect_uri=/fblogin/handleauth'
    };

    //TODO: Send response to client
    _sendRepsonse(SUCCESS_STATUS, facebookURI, res);

    console.log("end GET /fblogin");
});

/* GET users listing. */
router.get('/handleauth', function (req, res, next) {
    console.log("GET /fblogin/handleauth");

    console.log('facebook response' + req.data);
    var facebookResponse = {};

    //TODO: Send response to client
    //_sendRepsonse(SUCCESS_STATUS, facebookURI, res)

    console.log("end GET /fblogin/handleauth");
});

module.exports = router;
//# sourceMappingURL=fblogin.js.map