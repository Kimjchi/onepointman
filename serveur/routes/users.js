var express = require('express');
var router = express.Router();
const axios = require('axios');

const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const sender = require('../sender');
const facebookdata = require("../facebookdata");

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource user id :' + facebookdata.userAccessToken);
});

router.post(('/updateposition'), function (req, res) {

    let toUpdate = {
        iduser: req.body.iduser,
        userlg: req.body.userlg,
        userlt: req.body.userlt,
    };

    let getGroups = squel.select()
        .from('public."USER_GROUP"', 'ugr')
        .field('ugr.idgroup')
        .field('ugr.sharesposition')
        .where('ugr.iduser = ?', parseInt(toUpdate.iduser, 10))
        .toString();
    db.any(getGroups)
        .then((groups) => {
            console.log(groups);
            groups.forEach(element => {
                //pour chaque groupe, s'il décide de partager sa position avec, on update sa position
                let currentdate = new Date();
                console.log(currentdate);
                console.log(currentdate.toISOString());
                if (element.sharesposition === true) {
                    console.log("CRAZY DIAMOND");
                    let query = squel.update()
                        .table('public."USER_GROUP"')
                        .set('userglt', toUpdate.userlt)
                        .set('userglg', toUpdate.userlg)
                        .set('dateposition', currentdate.toISOString())
                        .where('iduser = ?', toUpdate.iduser)
                        .toString();
                    console.log(query);
                    db.none(query)
                        .then(() => {
                            console.log('Updated position of user in group ' + element.idgroup);
                        })
                        .catch(e => {
                            res.status(400);
                            res.send({
                                status: 'fail',
                                message: 'failing to update userposition in a group'
                            })
                        })
                }
            })
            res.send({
                status: 'success',
                message: 'Position updated successfully'
            })
        })
        .catch(e => {
            res.status(400);
            res.send({
                status: 'fail',
                message: e.toString()
            })
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

router.get('/userFriends/:user_id/', function (req, res) {
    console.log("GET /userFriends/:user_id/");

    let user_id = req.params.user_id;
    let userFriendList;

    _getUserFriendList(user_id)
        .then(response => {
            userFriendList = response.data.data;

            console.log('userFriendList : ' + userFriendList);

            sender.sendResponse(sender.SUCCESS_STATUS, userFriendList, res)
        })
        .catch(error => {
            console.log(error)
        });
});

const _getUserFriendList = (user_id) => {
    let userFriendListRequest = {
        redirectURI: 'https://graph.facebook.com/v2.11/',
        userAccessToken: facebookdata.userAccessToken,
        userID: user_id
    };

    return axios.get(userFriendListRequest.redirectURI + userFriendListRequest.userID + '/friends?access_token=' + userFriendListRequest.userAccessToken)
};

module.exports = router;
