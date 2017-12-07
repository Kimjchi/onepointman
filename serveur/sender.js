const express = require('express');
const router = express.Router();

const SUCCESS_STATUS = 200;
const REDIRECT_STATUS = 304;
const FAIL_STATUS = 400;

const _sendResponse = (status, message, res) => {
    res.status(status);
    res.send(message);
};

const sender = {
    SUCCESS_STATUS: 200,
    REDIRECT_STATUS: 304,
    NOT_FOUND_STATUS: 404,
    sendResponse: _sendResponse
};

module.exports = sender;