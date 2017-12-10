const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');


router.get('/', function(req, res, next) {

});

router.post('/createdrawing', function(req,res){
    let toCreate = {
        idcreator: req.body.iduser,
        idgroup: req.body.idgroup,
        description: req.body.description,
        lt: req.body.lt,
        lg: req.body.lg,
        img: req.body.img
    };

    let query = squel.insert()
        .into('public."DRAWING"')
        .set('idcreator', toCreate.idcreator)
        .set('idgroup', toCreate.idgroup)
        .set('description', toCreate.description)
        .set('drawinglt', toCreate.lt)
        .set('drawinglg', toCreate.lg)
        .set('img', toCreate.img)
        .toString();

    db.one(query)
        .then((row)=>{
            let response = {
                iddrawing : row.iddrawing
            };
            sender.sendResponse(sender.SUCCESS_STATUS, response, res)
        })
        .catch(e => {
            sender.sendResponse(sender.NOT_FOUND_STATUS, 'Error while creating drawing', res);
            console.log(e);
        })
});

//Ce serait peut etre mieux de le supprimer carrément? plutôt que de le set inactif
router.post('deletedrawing', function(req,res){
   let toDelete = {
       iddrawing: req.body.iddrawing
   };

   let query = squel.update()
       .table('public."DRAWING"')
       .set('actif', false)
       .where('iddrawing = ?', toDelete.iddrawing)
       .toString();
    db.none(query)
        .then(()=>{
            let response = {
                status : 'success'
            };
            sender.sendResponse(sender.SUCCESS_STATUS, response, res)
        })
        .catch(e=>{
            sender.sendResponse(sender.NOT_FOUND_STATUS, 'Error while deleting drawing', res);
            console.log(e);
        })
});

module.exports = router;
