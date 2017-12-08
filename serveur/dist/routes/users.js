'use strict';

var express = require('express');
var router = express.Router();
var axios = require('axios');

var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

var sender = require('../sender');
var facebookdata = require("../facebookdata");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource user id :' + facebookdata.userAccessToken);
});

router.post('/updateposition', function (req, res) {

    var toUpdate = {
        iduser: req.body.iduser,
        userlg: req.body.userlg,
        userlt: req.body.userlt
    };

    var getGroups = squel.select().from('public."USER_GROUP"', 'ugr').field('ugr.idgroup').field('ugr.sharesposition').where('ugr.iduser = ?', parseInt(toUpdate.iduser, 10)).toString();
    db.any(getGroups).then(function (groups) {
        console.log(groups);
        groups.forEach(function (element) {
            //pour chaque groupe, s'il décide de partager sa position avec, on update sa position
            var currentdate = new Date();
            console.log(currentdate);
            console.log(currentdate.toISOString());
            if (element.sharesposition === true) {
                console.log("CRAZY DIAMOND");
                var query = squel.update().table('public."USER_GROUP"').set('userglt', toUpdate.userlt).set('userglg', toUpdate.userlg).set('dateposition', currentdate.toISOString()).where('iduser = ?', toUpdate.iduser).toString();
                console.log(query);
                db.none(query).then(function () {
                    console.log('Updated position of user in group ' + element.idgroup);
                }).catch(function (e) {
                    res.status(400);
                    res.send({
                        status: 'fail',
                        message: 'failing to update userposition in a group'
                    });
                });
            }
        });
        res.send({
            status: 'success',
            message: 'Position updated successfully'
        });
    }).catch(function (e) {
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
        //sender gnagnanga
    });

    /* let query = squel.update()
         .table('public."USER"')
         .set('userlt', toUpdate.userlt)
         .set('userlg', toUpdate.userlg)
         .where('iduser = ?', toUpdate.iduser)
         .toString();
     console.log(query);
     db.none(query)
         .then(() => {
             res.send({
                 status: 'success',
                 message: "La position a été mise à jour avec succès "
             });
             //sender blablabla
         })
         .catch(e => {
             res.status(400);
             res.send({
                 status: 'fail',
                 message: e.toString()
             })
             //sender gnagnanga
         });*/
});

router.post('/updatepositionsharing', function (req, res) {

    var toUpdate = {
        iduser: req.body.iduser,
        idgroup: req.body.idgroup,
        positionSharing: req.body.positionSharing
    };

    var query = squel.update().table('public."USER_GROUP"').set('sharesposition', toUpdate.positionSharing).where('iduser = ?', toUpdate.iduser).where('idgroup = ?', toUpdate.idgroup).toString();

    db.query(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, 'Position sharing updated successfully', res);
    }).catch(function (e) {
        sender.sendResponse(sender.NOT_FOUND_STATUS, e, res);
        console.log(e);
    });
});

router.get('/deleteuser', function (req, res) {

    var toUpdate = {
        iduser: req.query.iduser,
        idgroup: req.query.idgroup
    };

    var query = squel.delete().from('public."USER_GROUP"').where('iduser = ?', toUpdate.iduser).where('idgroup = ?', toUpdate.idgroup).toString();

    db.query(query).then(function () {
        sender.sendResponse(sender.SUCCESS_STATUS, 'User deleted from group successfully', res);
    }).catch(function (e) {
        sender.sendResponse(sender.NOT_FOUND_STATUS, e, res);
        console.log(e);
    });
});

router.get('/userFriends/:user_id/', function (req, res) {
    console.log("GET /userFriends/:user_id/");

    var user_id = req.params.user_id;
    var userFriendList = void 0;

    _getUserFriendList(user_id).then(function (response) {
        userFriendList = response.data.data;

        console.log('userFriendList : ' + userFriendList);

        sender.sendResponse(sender.SUCCESS_STATUS, userFriendList, res);
    }).catch(function (error) {
        console.log(error);
    });
});

var _getUserFriendList = function _getUserFriendList(user_id) {
    var userFriendListRequest = {
        redirectURI: 'https://graph.facebook.com/v2.11/',
        userAccessToken: facebookdata.userAccessToken,
        userID: user_id
    };

    return axios.get(userFriendListRequest.redirectURI + userFriendListRequest.userID + '/friends?access_token=' + userFriendListRequest.userAccessToken);
};

module.exports = router;
//# sourceMappingURL=users.js.map