const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

const sender = require('../sender');

//donne les groupes auxquels appartient un utilisateur + les membres du groupe
router.get('/:iduser/', function (req, res) {
    let iduser = req.params.iduser;
    let groups = getUsersInGroups(iduser);
    db.any(groups)
        .then((tableau) => {
            let toReturn = buildGroupsObject(tableau);
            res.send({
                status: 'success',
                message: toReturn
            });
            //sender.sendResponse(sender.SUCCESS_STATUS, toReturn, res);

        })
        .catch(e => {
            res.status(400);
            res.send({
                status: 'fail',
                message: e.toString()
            });
            //sender.sendResponse(sender.BAD_REQUEST, toReturn, res);
        });

});

let getGroups = (iduser) =>
    squel.select()
        .from('public."USER_GROUP"', 'ugr')
        .field('ugr.idgroup')
        .field('gr.nom')
        .field('ugr.sharesposition')
        .where('ugr.iduser = ?', iduser)
        .left_join('public."GROUP"', 'gr', 'ugr.idgroup = gr.idgroup')
;

let getUsersInGroups = (iduser) =>
    squel.select()
        .from(getGroups(iduser), 'listgroups')
        .left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = listgroups.idgroup')
        .left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser')
        .field('listgroups.sharesposition')
        .field('usr.prenom')
        .field('usr.nom', 'nomuser')
        .field('usr.iduser')
        .field('listgroups.nom', 'nomgroup')
        .field('ugr.idgroup')
        .toString();

function buildGroupsObject(queryResult) {
    var groups = [];
    queryResult.forEach((element, index) => {
        // le resultat de la requete donne un tableau de {prenom, nomuser, iduser, nomgroup, idgroup}
        let contains = false;
        let idPosition;
        // si l'id du groupe n'existe pas encore dans le tableau, on le push et on crée un ligne pour le groupe
        groups.forEach(grelement => {
            if (element.idgroup === grelement.idgroup) {
                contains = true;
                idPosition = index;
            }
        });
        if (!contains) {
            groups.push({idgroup: element.idgroup, issharing: element.sharesposition, nomgroup: element.nomgroup, membres: []})
        }
    });
    //une fois le tableau des groupes créé, on push les membres dans groups[idGroupConcerné].membres
    queryResult.forEach((element) => {
        let idGroupeConcerne;
        //on get la position dans groups du groupe concerné pour l'user (element)
        groups.forEach((grelement, grindex) => {
            if (grelement.idgroup === element.idgroup) {
                idGroupeConcerne = grindex;
                groups[idGroupeConcerne].membres.push({
                    iduser: element.iduser,
                    prenom: element.prenom,
                    nomuser: element.nomuser
                });
            }
        })
    });
    return groups;

}

// https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
// Pour check les daaaates hehehe


//SSSSIIII l'utilisateur partage sa position avec le groupe , ne pas l'envoyer
// +++ ne pas envoyer les user si leur position est nulle


// les infos d'un groupe en particulier (les pinpoints et les positions des utilisateurs du groupe
router.get('/positions/:iduser/:idgroup', function(req,res){
    //vérifier si l'utilisateur est bien dans le groupe avant de faire le traitement
   let iduser = parseInt(req.params.iduser, 10);
   let idgroup = req.params.idgroup;
//pour le groupe : renvoyer son nom, les pinpoints qui lui sont associés, les dessins,
// les positions des gens SSI ils décident de la partager avec ce groupe
    let requete = getGroupPinpoints(idgroup);
    db.any(requete)
        .then((result) =>{
            let JSONToReturn = {idgroup: idgroup, issharing: false,  pinpoints:[], userpositions:[]};
            result.forEach(element => {

                // CHECK SI LA DATE est supérieure de 1 jour de plus de la date de RDV. sinon ne
                let currentTime = new Date();
                let diff = currentTime - element.daterdv;// donne la diff en millisecondes
                let dontPush = false;
                if(diff > 8.64e+7){// le nombre de millisecs en 1 jour hehe
                    dontPush = true;
                }
                console.log(diff);
                //pas renvoyer
                let pinpoint = {
                    idpinpoint: element.idpinpoint,
                    idcreator: element.idcreator,
                    nomcreator: element.nom,
                    prenomcreator: element.prenom,
                    pinlt: element.pinlt,
                    pinlg:element.pinlg,
                    description:element.description,
                    daterdv:element.daterdv
                };
                //si la date est ok on le push dans l'array
                if(!dontPush){
                    JSONToReturn.pinpoints.push(pinpoint);

                }
            });
            db.any(getUsersPositions(idgroup))
                .then((userpositions) => {

                    let currentDate = new Date();
                    let userCorrectRequest = false;
                    userpositions.forEach(element =>{

                        if(parseInt(element.iduser,10) === iduser) {
                            userCorrectRequest = true; // on vérifie ici si le gars qui demande est bien dans le groupe
                            JSONToReturn.issharing = element.sharesposition;


                        }
                        let isCurrent = false;
                        if(element.dateposition !== null){
                            isCurrent = compareTimes(currentDate, element.dateposition);
                        }


                        let userposition = {
                           iduser: element.iduser,
                            prenom: element.prenom,
                            nom:element.nom,
                           userlt:element.userglt,
                           userlg:element.userglg,
                           current:isCurrent,
                           dateposition:element.dateposition
                       };
                        if(element.dateposition !== null){
                            if(!(parseInt(element.iduser,10) === iduser && element.sharesposition)){
                                JSONToReturn.userpositions.push(userposition);
                            }
                        }
                    });

                    if(userCorrectRequest){
                        res.send({
                            status: 'success',
                            message: JSONToReturn
                        });
                    }
                    else{
                        res.status(400);
                        res.send({
                            status:'fail',
                            message: 'You requested the informations of a group in which you DON\'T belong, bitch'
                        })
                    }

                })
                .catch(err => {
                    res.status(400);
                    res.send({
                        status: 'fail',
                        message: err.toString()
                    })
                })
        })
        .catch(e => {
            res.status(400);
            res.send({
                status: 'fail',
                message: e.toString()
            })
        });


});

let getGroupPinpoints = (idgroup) =>
    squel.select()
        .from('public."GROUP"', 'gr')
        .field('gr.nom', 'nomgroup')
        .field('gr.idgroup')
        .field('pin.idcreator')
        .field('pin.idpinpoint')
        .field('pin.pinlt')
        .field('pin.pinlg')
        .field('pin.description')
        .field('pin.daterdv')
        .field('usr.prenom')
        .field('usr.nom')
        .left_join('public."PINPOINT"', 'pin', 'pin.idgroup = gr.idgroup')
        .left_join('public."USER"', 'usr', 'usr.iduser = pin.idcreator')
        .where('gr.idgroup = ?', idgroup)
        .toString();

let getUsersPositions = (idgroup) =>
    squel.select()
        .from('public."GROUP"', 'gr')
        .field('ugr.iduser')
        .field('ugr.sharesposition')
        .field('ugr.userglt')
        .field('ugr.userglg')
        .field("ugr.dateposition")
        .field('usr.nom')
        .field('usr.prenom')
        .left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = gr.idgroup')
        .left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser')
        .where('gr.idgroup = ?', idgroup)
        .toString();


//Si la dernière position stockée est > 15min, l'utilisateur est considéré comme inactif
function compareTimes(currentTime, lastLocationTime){
    let toReturn = false;
    if(currentTime.getMonth() === lastLocationTime.getMonth()){
        if(currentTime.getDay() === lastLocationTime.getDay()){
            if(currentTime.getHours() === lastLocationTime.getHours()){
                if(currentTime.getMinutes() - lastLocationTime.getMinutes() < 15){
                    toReturn = true;
                }
            }
        }
    }
    return toReturn;
}

router.get('/drawings/:iduser/:idgroup', function(req,res){
    let iduser = req.params.iduser;
    let idgroup = req.params.idgroup;
    let query = getDrawings(idgroup);
    let JSONToReturn = {
        idgroup: idgroup,
        drawings:[]
    };

    db.any(query)
        .then((result) =>{
            result.forEach(element =>{
                let objectToPush = {
                    iddrawing : element.iddrawing,
                    idcreator: element.idcreator,
                    nomcreator: element.nom,
                    prenomcreator: element.prenom,
                    description: element.description,
                    lt: element.lt,
                    lg: element.lg,
                    img: element.img
                };
                if(element.actif){
                    JSONToReturn.drawings.push(objectToPush);
                }
            });
            console.log(JSONToReturn);
            res.send({
                status: 'success',
                message: JSONToReturn
            });
        })
        .catch( e => {
            res.status(400);
            res.send({
                status: 'fail',
                message: e.toString()
            });
        });

});


let getDrawings = (idgroup) =>
    squel.select()
        .from('public."DRAWING"', 'draw')
        .field('draw.iddrawing')
        .field('draw.idcreator')
        .field('draw.actif')
        .field('draw.img')
        .field('draw.drawinglg', 'lg')
        .field('draw.drawinglt', 'lt')
        .field('description')
        .field('usr.nom')
        .field('usr.prenom')
        .left_join('public."USER"', 'usr', 'usr.iduser = draw.idcreator')
        .where('draw.idgroup = ?', idgroup)
        .toString();

//ca passe en post
router.post('/creategroup', function (req, res) {

    let toCreate = {
        iduser: req.body.iduser,
        groupname: req.body.groupname
    };

    let currentTime = new Date();
    let query = squel.insert()
        .into('public."GROUP"')
        .set('nom', toCreate.groupname)
        .set('creationdate', currentTime.toISOString())
        .returning('idgroup')
        .toString();

    db.one(query)
        .then((row)=>{
            let inUserGroup = squel.insert()
                .into('public."USER_GROUP"', 'ugr')
                .set('idgroup', row.idgroup)
                .set('iduser', toCreate.iduser)
                .set('iscreator', true)
                .toString();
            db.none(inUserGroup)
                .then(()=>{
                    let response = {
                        idgroup : row.idgroup
                    };
                    sender.sendResponse(sender.SUCCESS_STATUS, response, res)
                })
                .catch(err=>{
                    sender.sendResponse(sender.BAD_REQUEST, 'Failed to insert user in USER_GROUP', res);
                    console.log(err);
                })

        })
        .catch(e => {
            sender.sendResponse(sender.BAD_REQUEST, 'Failed to create group', res);
            console.log(e);
        })
});

router.post('/changegroupname', function(req,res){
    let toChange = {
        idgroup: req.body.idgroup,
        groupname:req.body.newgroupname
    };

    let query = squel.update()
        .table('public."GROUP"')
        .set('nom', toChange.groupname)
        .where('idgroup = ?', toChange.idgroup)
        .toString();
    db.none(query)
        .then(()=>{
        let response = {status: 'success',message:'groupname updated successfully'};
            sender.sendResponse(sender.SUCCESS_STATUS, response, res)
        })
        .catch(e=>{
            sender.sendResponse(sender.BAD_REQUEST, {status:'fail',message:'Failed to update groupname'}, res);
            console.log(e);
        })

});

module.exports = router;
