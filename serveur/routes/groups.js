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
            })
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

// les infos d'un groupe en particulier
router.get('/:iduser/:idgroup', function(req,res){
    //vérifier si l'utilisateur est bien dans le groupe avant de faire le traitement

   let iduser = req.params.iduser;
   let idgroup = req.params.idgroup;
//pour le groupe : renvoyer son nom, les pinpoints qui lui sont associés, les dessins,
// les positions des gens SSI ils décident de la partager avec ce groupe
    let requete = addUsersInfosToTable(idgroup);
    db.any(requete)
        .then((result) =>{
            res.send({
                status: 'success',
                message: result
            });
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

let getGroupInfos = (idgroup) =>
    squel.select()
        .from('public."GROUP"', 'gr')
        .field('gr.nom', 'nomgroup')
        .field('ugr.iduser')
        .field('gr.idgroup')
        .field('ugr.sharesposition')
        .field('pin.idpinpoint')
        .field('draw.iddrawing')
        .left_join('public."DRAWING"', 'draw', 'draw.idgroup = gr.idgroup')
        .left_join('public."PINPOINT"', 'pin', 'pin.idgroup = gr.idgroup')
        .left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = gr.idgroup')
        .where('gr.idgroup = ?', idgroup);

let addUsersInfosToTable = (idgroup) =>
    squel.select()
        .from(getGroupInfos(idgroup), 'groupinfos')
        .left_join('public."USER"', 'usr', 'usr.iduser = groupinfos.iduser')
        .field('groupinfos.nomgroup')
        .field('groupinfos.iduser')
        .field('groupinfos.idgroup')
        .field('groupinfos.sharesposition')
        .field('groupinfos.idpinpoint')
        .field('groupinfos.iddrawing')
        .field('usr.nom', 'nomuser')
        .field('usr.prenom')
       // .field('usr.userlt')
       // .field('usr.userlg')
        .toString();



module.exports = router;
