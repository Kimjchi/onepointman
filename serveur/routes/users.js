var express = require('express');
var router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const sender = require('../sender');
const facebookdata = require("../facebookdata");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post(('/updateposition'), function(req, res){

    let toUpdate = {
        iduser : req.body.iduser,
        userlg: req.body.userlg,
        userlt: req.body.userlt,
    };

    let getGroups = squel.select()
        .from('public."USER_GROUP"', 'ugr')
        .field('ugr.idgroup')
        .field('ugr.sharesposition')
        .where('ugr.iduser = ?', parseInt(toUpdate.iduser,10))
        .toString();
    db.any(getGroups)
        .then((groups) =>{
            let currentTime = new Date();
            let updateUserTable = squel.update()
                .table('public."USER"')
                .set('lg', toUpdate.userlg)
                .set('lt',toUpdate.userlt)
                .set('dateposition', currentTime.toISOString())
                .where('iduser = ?', toUpdate.iduser)
                .toString();
            db.none(updateUserTable)
                .then(() => {
                    console.log('Updated position of user in USER ');
                    console.log(groups);
                    groups.forEach(element => {
                        //pour chaque groupe, s'il décide de partager sa position avec, on update sa position
                        if (element.sharesposition === true) {
                            let query = squel.update()
                                .table('public."USER_GROUP"')
                                .set('userglt', toUpdate.userlt)
                                .set('userglg', toUpdate.userlg)
                                .set('dateposition', currentTime.toISOString())
                                .where('iduser = ?', toUpdate.iduser)
                                .toString();
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
            });
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
        })
});

router.get('/userFriends/:iuser_id', function(req, res, next) {
    console.log("GET /userFriends/:iuser_id");

    let user_id = req.params.user_id;
    let userFriendList;

    _getUserFriendList(user_id)
        .then(response => {
            userFriendList = response.data.data;

            console.log(userFriendList);

            //TODO: Send response to client
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
