'use strict';

var express = require('express');
var router = express.Router();

var SUCCESS_STATUS = 200;
var REDIRECT_STATUS = 304;
var FAIL_STATUS = 400;

var _sendResponse = function _sendResponse(status, message, res) {
    res.status(status);
    res.send(message);
};

var sender = {
    SUCCESS_STATUS: 200,
    REDIRECT_STATUS: 304,
    NOT_FOUND_STATUS: 404,
    sendResponse: _sendResponse
};

module.exports = sender;
//# sourceMappingURL=sender.js.map