'use strict';

var express = require('express');
var router = express.Router();
var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

var sender = require('../sender');

router.post('/createpinpoint/', function (req, res) {

    var toCreate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        pinlg: req.body.pinlg,
        pinlt: req.body.pinlt,
        description: req.body.description
    };

    var query = squel.insert().into('public."PINPOINT"').set('idcreator', toCreate.iduser).set('idgroup', toCreate.idgroup).set('pinlt', toCreate.pinlt).set('pinlg', toCreate.pinlg).set('description', toCreate.description).toString();

    db.query(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, 'Pinpoint created', res);
    }).catch(function (e) {
        sender.sendResponse(sender.NOT_FOUND_STATUS, 'Error while creating pinpoint', res);
        console.log(e);
    });
});

router.delete('/deletepinpoint/', function (req, res) {

    var toDelete = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        idpinpoint: req.body.idpinpoint
    };

    var query = squel.delete().from('public."PINPOINT"').where('idcreator = ?', toDelete.iduser).where('idgroup = ?', toDelete.idgroup).where('idpinpoint = ?', toDelete.idpinpoint).toString();

    db.query(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, 'Pinpoint deleted', res);
    }).catch(function (e) {
        sender.sendResponse(sender.NOT_FOUND_STATUS, 'Error while deleting pinpoint', res);
        console.log(e);
    });
});

module.exports = router;
//# sourceMappingURL=pinpoint.js.map