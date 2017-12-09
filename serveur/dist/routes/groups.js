'use strict';

var express = require('express');
var router = express.Router();
var db = require('../connection');
var squelb = require('squel');
var squel = squelb.useFlavour('postgres');

//donne les groupes auxquels appartient un utilisateur + les membres du groupe
router.get('/:iduser/', function (req, res) {
    var iduser = req.params.iduser;
    var groups = getUsersInGroups(iduser);
    db.any(groups).then(function (tableau) {
        var toReturn = buildGroupsObject(tableau);
        res.send({
            status: 'success',
            message: toReturn
        });
        //sender.sendResponse(sender.SUCCESS_STATUS, toReturn, res);
    }).catch(function (e) {
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
        //sender.sendResponse(sender.NOT_FOUND_STATUS, toReturn, res);
    });
});

var getGroups = function getGroups(iduser) {
    return squel.select().from('public."USER_GROUP"', 'ugr').field('ugr.idgroup').field('gr.nom').where('ugr.iduser = ?', iduser).left_join('public."GROUP"', 'gr', 'ugr.idgroup = gr.idgroup');
};

var getUsersInGroups = function getUsersInGroups(iduser) {
    return squel.select().from(getGroups(iduser), 'listgroups').left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = listgroups.idgroup').left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser').field('usr.prenom').field('usr.nom', 'nomuser').field('usr.iduser').field('listgroups.nom', 'nomgroup').field('ugr.idgroup').toString();
};

function buildGroupsObject(queryResult) {
    var groups = [];
    queryResult.forEach(function (element, index) {
        // le resultat de la requete donne un tableau de {prenom, nomuser, iduser, nomgroup, idgroup}
        var contains = false;
        var idPosition = void 0;
        // si l'id du groupe n'existe pas encore dans le tableau, on le push et on crée un ligne pour le groupe
        groups.forEach(function (grelement) {
            if (element.idgroup === grelement.idgroup) {
                contains = true;
                idPosition = index;
            }
        });
        if (!contains) {
            groups.push({ idgroup: element.idgroup, nomgroup: element.nomgroup, membres: [] });
        }
    });
    //une fois le tableau des groupes créé, on push les membres dans groups[idGroupConcerné].membres
    queryResult.forEach(function (element) {
        var idGroupeConcerne = void 0;
        //on get la position dans groups du groupe concerné pour l'user (element)
        groups.forEach(function (grelement, grindex) {
            if (grelement.idgroup === element.idgroup) {
                idGroupeConcerne = grindex;
                groups[idGroupeConcerne].membres.push({
                    iduser: element.iduser,
                    prenom: element.prenom,
                    nomuser: element.nomuser
                });
            }
        });
    });
    return groups;
}

// https://stackoverflow.com/questions/16767301/calculate-difference-between-2-timestamps-using-javascript
// Pour check les daaaates hehehe


//SSSSIIII l'utilisateur partage sa position avec le groupe , ne pas l'envoyer
// +++ ne pas envoyer les user si leur position est nulle


// les infos d'un groupe en particulier (les pinpoints et les positions des utilisateurs du groupe
router.get('/positions/:iduser/:idgroup', function (req, res) {
    //vérifier si l'utilisateur est bien dans le groupe avant de faire le traitement
    var iduser = parseInt(req.params.iduser, 10);
    var idgroup = req.params.idgroup;
    //pour le groupe : renvoyer son nom, les pinpoints qui lui sont associés, les dessins,
    // les positions des gens SSI ils décident de la partager avec ce groupe
    var requete = getGroupPinpoints(idgroup);
    db.any(requete).then(function (result) {
        var JSONToReturn = { idgroup: idgroup, pinpoints: [], userpositions: [] };
        result.forEach(function (element) {

            // CHECK SI LA DATE est supérieure de 1 jour de plus de la date de RDV. sinon ne
            //pas renvoyer
            var pinpoint = {
                idpinpoint: element.idpinpoint,
                idcreator: element.idcreator,
                nomcreator: element.nom,
                prenomcreator: element.prenom,
                pinlt: element.pinlt,
                pinlg: element.pinlg,
                description: element.description,
                daterdv: element.daterdv
            };
            //si la date est ok on le push dans l'array
            JSONToReturn.pinpoints.push(pinpoint);
        });
        db.any(getUsersPositions(idgroup)).then(function (userpositions) {
            console.log(getUsersPositions(idgroup));
            var currentDate = new Date();
            var userCorrectRequest = false;
            userpositions.forEach(function (element) {
                if (parseInt(element.iduser, 10) === iduser) {
                    userCorrectRequest = true; // on vérifie ici si le gars qui demande est bien dans le groupe
                }
                var isCurrent = false;
                if (element.dateposition !== null) {
                    isCurrent = compareTimes(currentDate, element.dateposition);
                }

                var userposition = {
                    iduser: element.iduser,
                    prenom: element.prenom,
                    nom: element.nom,
                    userlt: element.userglt,
                    userlg: element.userglg,
                    current: isCurrent,
                    dateposition: element.dateposition
                };
                if (element.dateposition !== null) {
                    if (!(parseInt(element.iduser, 10) === iduser && element.sharesposition)) {
                        JSONToReturn.userpositions.push(userposition);
                    }
                }
            });

            if (userCorrectRequest) {
                res.send({
                    status: 'success',
                    message: JSONToReturn
                });
            } else {
                res.status(400);
                res.send({
                    status: 'fail',
                    message: 'You requested the informations of a group in which you DON\'T belong, bitch'
                });
            }
        }).catch(function (err) {
            res.status(400);
            res.send({
                status: 'fail',
                message: err.toString()
            });
        });
    }).catch(function (e) {
        res.status(400);
        res.send({
            status: 'fail',
            message: e.toString()
        });
    });
    console.log(requete);
});

var getGroupPinpoints = function getGroupPinpoints(idgroup) {
    return squel.select().from('public."GROUP"', 'gr').field('gr.nom', 'nomgroup').field('gr.idgroup').field('pin.idcreator').field('pin.idpinpoint').field('pin.pinlt').field('pin.pinlg').field('pin.description').field('pin.daterdv').field('usr.prenom').field('usr.nom').left_join('public."PINPOINT"', 'pin', 'pin.idgroup = gr.idgroup').left_join('public."USER"', 'usr', 'usr.iduser = pin.idcreator').where('gr.idgroup = ?', idgroup).toString();
};

var getUsersPositions = function getUsersPositions(idgroup) {
    return squel.select().from('public."GROUP"', 'gr').field('ugr.iduser').field('ugr.sharesposition').field('ugr.userglt').field('ugr.userglg').field("ugr.dateposition").field('usr.nom').field('usr.prenom').left_join('public."USER_GROUP"', 'ugr', 'ugr.idgroup = gr.idgroup').left_join('public."USER"', 'usr', 'usr.iduser = ugr.iduser').where('gr.idgroup = ?', idgroup).toString();
};

//Si la dernière position stockée est > 15min, l'utilisateur est considéré comme inactif
function compareTimes(currentTime, lastLocationTime) {
    var toReturn = false;
    if (currentTime.getMonth() === lastLocationTime.getMonth()) {
        if (currentTime.getDay() === lastLocationTime.getDay()) {
            if (currentTime.getHours() === lastLocationTime.getHours()) {
                if (currentTime.getMinutes() - lastLocationTime.getMinutes() < 15) {
                    toReturn = true;
                }
            }
        }
    }
    return toReturn;
}

module.exports = router;
//# sourceMappingURL=groups.js.map