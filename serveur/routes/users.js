var express = require('express');
var router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

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

module.exports = router;