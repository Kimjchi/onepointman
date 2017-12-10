'use strict';

var express = require('express');
var router = express.Router();
var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

router.get('/', function (req, res, next) {});

router.post('/createdrawing', function (req, res) {
    var toCreate = {
        idcreator: req.body.iduser,
        idgroup: req.body.idgroup,
        description: req.body.description,
        lt: req.body.lt,
        lg: req.body.lg,
        img: req.body.img
    };

    var query = squel.insert().into('public."DRAWING"').set('idcreator', toCreate.idcreator).set('idgroup', toCreate.idgroup).set('description', toCreate.description).set('drawinglt', toCreate.lt).set('drawinglg', toCreate.lg).set('img', toCreate.img).toString();

    db.one(query).then(function (row) {
        var response = {
            iddrawing: row.iddrawing
        };
        sender.sendResponse(sender.SUCCESS_STATUS, response, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while creating drawing' }, res);
        console.log(e);
    });
});

//Ce serait peut etre mieux de le supprimer carrément? plutôt que de le set inactif
router.post('deletedrawing', function (req, res) {
    var toDelete = {
        iddrawing: req.body.iddrawing
    };

    var query = squel.update().table('public."DRAWING"').set('actif', false).where('iddrawing = ?', toDelete.iddrawing).toString();
    db.none(query).then(function () {
        var response = {
            status: 'success',
            message: 'Drawing deleted successfully'
        };
        sender.sendResponse(sender.SUCCESS_STATUS, response, res);
    }).catch(function (e) {
        sender.sendResponse(sender.BAD_REQUEST, { status: 'fail', message: 'Error while deleting drawing' }, res);
        console.log(e);
    });
});

module.exports = router;
//# sourceMappingURL=drawing.js.map