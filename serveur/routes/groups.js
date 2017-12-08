const express = require('express');
const router = express.Router();
const db = require('../connection');
const squelb = require('squel');
const squel = squelb.useFlavour('postgres');

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
            //sender.sendResponse(sender.NOT_FOUND_STATUS, toReturn, res);
        });

});

let getGroups = (iduser) =>
    squel.select()
        .from('public."USER_GROUP"', 'ugr')
        .field('ugr.idgroup')
        .field('gr.nom')
        .where('ugr.iduser = ?', iduser)
        .left_join('public."GROUP"', 'gr', 'ugr.idgroup = gr.idgroup')
;

let getUsersInGroups = (iduser) =>
    squel.select()
        .from(getGroups(iduser), 'listgroups')
        .left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = listgroups.idgroup')
        .left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser')
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
            groups.push({idgroup: element.idgroup, nomgroup: element.nomgroup, membres: []})
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
            let JSONToReturn = {idgroup: idgroup, pinpoints:[], userpositions:[]};
            result.forEach(element => {
                // CHECK SI LA DATE est supérieure de 1 jour de plus de la date de RDV. sinon ne
                //pas renvoyer
                let pinpoint = {
                    idpinpoint: element.idpinpoint,
                    idcreator: element.idcreator,
                    pinlt: element.pinlt,
                    pinlg:element.pinlg,
                    description:element.description,
                    daterdv:element.daterdv
                };
                //si la date est ok on le push dans l'array
                JSONToReturn.pinpoints.push(pinpoint);
            });
            db.any(getUsersPositions(idgroup))
                .then((userpositions) => {
                    let userCorrectRequest = false;
                    userpositions.forEach(element =>{
                        console.log(typeof element.iduser);
                        console.log(typeof iduser);
                        if(element.iduser === iduser){
                            userCorrectRequest = true; // on vérifie ici si le gars qui demande est bien dans le groupe
                        }
                        let userposition = {
                           iduser: element.iduser,
                           userlt:element.userglt,
                           userlg:element.userglg,
                           current:true, // A CHANGER CO LO APRES LE TRAITEMENT LO
                           dateposition:element.dateposition
                       };
                       JSONToReturn.userpositions.push(userposition);
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
    console.log(requete);


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
        .left_join('public."PINPOINT"', 'pin', 'pin.idgroup = gr.idgroup')
        .where('gr.idgroup = ?', idgroup)
        .toString();

let getUsersPositions = (idgroup) =>
    squel.select()
        .from('public."GROUP"', 'gr')
        .field('ugr.iduser')
        .field('ugr.sharesposition')
        .field('ugr.userglt')
        .field('ugr.userglg')
        .field('ugr.dateposition')
        .left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = gr.idgroup')
        .where('gr.idgroup = ?', idgroup)
        .toString();



module.exports = router;
