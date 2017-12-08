const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const sender = require('../sender');

router.post('/createpinpoint/', function (req, res) {

    let toCreate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        pinlg: req.body.pinlg,
        pinlt: req.body.pinlt,
        description: req.body.description,
    };

    let query = squel.insert()
        .into('public."PINPOINT"')
        .set('idcreator', toCreate.iduser)
        .set('idgroup', toCreate.idgroup)
        .set('pinlt', toCreate.pinlt)
        .set('pinlg', toCreate.pinlg)
        .set('description', toCreate.description)
        .toString();

    db.query(query)
        .then(()=>{
            sender.sendResponse(sender.SUCCESS_STATUS, 'Pinpoint created', res)
        })
        .catch(e => {
            sender.sendResponse(sender.NOT_FOUND_STATUS, 'Error while creating pinpoint', res);
            console.log(e);
        })

});

router.delete('/deletepinpoint/', function (req, res) {

    let toDelete = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        idpinpoint: req.body.idpinpoint,
    };

    let query = squel.delete()
        .from('public."PINPOINT"')
        .where('idcreator = ?', toDelete.iduser)
        .where('idgroup = ?', toDelete.idgroup)
        .where('idpinpoint = ?', toDelete.idpinpoint)
        .toString();

    db.query(query)
        .then(()=>{
            sender.sendResponse(sender.SUCCESS_STATUS, 'Pinpoint deleted', res)
        })
        .catch(e => {
            sender.sendResponse(sender.NOT_FOUND_STATUS, 'Error while deleting pinpoint', res);
            console.log(e);
        })

});

module.exports = router;