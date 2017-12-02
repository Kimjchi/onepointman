const express = require('express');
const router = express.Router();

const SUCCESS_STATUS = 200;
const REDIRECT_STATUS = 304;
const NOT_FOUND_STATUS = 404;

const _sendRepsonse = (status, message, res) => {
    res.status(status);
    res.send(message);
};

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("GET /fblogin");

    let facebookURI = {
        redirectURI: 'https://www.facebook.com/v2.11/dialog/oauth?',
        client_id: '137357800216709',
        redirect_uri: 'http://localhost:3000/Home'
    };

    //TODO: Send response to client
    _sendRepsonse(SUCCESS_STATUS, facebookURI, res)

    console.log("end GET /fblogin");
});

/* GET users listing. */
router.get('/handleauth', function(req, res, next) {
    console.log("GET /fblogin/handleauth");

    console.log('facebook response' + req.data)
    let facebookResponse = {};

    //TODO: Send response to client
    //_sendRepsonse(SUCCESS_STATUS, facebookURI, res)

    console.log("end GET /fblogin/handleauth");
});

module.exports = router;