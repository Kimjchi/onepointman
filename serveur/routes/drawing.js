const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');


router.get('/', function(req, res, next) {

});

module.exports = router;
