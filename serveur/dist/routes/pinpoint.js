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
        description: req.body.description,
        daterdv: req.body.daterdv
    };

    var dateexpiration = new Date(toCreate.daterdv);
    dateexpiration.setDate(dateexpiration.getDate() + 1);

    var query = squel.insert().into('public."PINPOINT"').set('idcreator', parseInt(toCreate.iduser, 10)).set('idgroup', parseInt(toCreate.idgroup, 10)).set('pinlt', parseInt(toCreate.pinlt, 10)).set('pinlg', parseInt(toCreate.pinlg, 10)).set('description', toCreate.description).set('daterdv', toCreate.daterdv).set('dateexp', dateexpiration.toLocaleDateString() + ' ' + dateexpiration.toLocaleTimeString()).returning('idpinpoint').toString();

    db.one(query).then(function (row) {
        var response = {
            idpinpoint: row.idpinpoint
        };
        sender.sendResponse(sender.SUCCESS_STATUS, response, res);
    }).catch(function (e) {
        console.log(e);
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while creating pinpoint' }, res);
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
        sender.sendResponse(sender.SUCCESS_STATUS, { status: 'success', message: 'Pinpoint deleted' }, res);
    }).catch(function (e) {
        console.log(e);
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while deleting pinpoint' }, res);
    });
});

module.exports = router;
//# sourceMappingURL=pinpoint.js.map