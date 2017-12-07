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

router.get(('/updateposition/:iduser/:lt/:lg'), function(req, res){
    let iduser = req.params.iduser;
    let lt = req.params.lt;
    let lg = req.params.lg;
    let query = squel.update()
        .table('public."USER"')
        .set('userlt', lt)
        .set('userlg', lg)
        .where('iduser = ?', iduser)
        .toString();
    console.log(query);
    db.none(query)
        .then(() => {
            res.send({
                message: "La position a été mise à jour avec succès "
            });
            //sender blablabla
        })
        .catch(e => {
            res.status(400);
            res.send({
                message: e.toString()
            })
            //sender gnagnanga
        });

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
    }

    return axios.get(userFriendListRequest.redirectURI + userFriendListRequest.userID + '/friends?access_token=' + userFriendListRequest.userAccessToken)
};

module.exports = router;
