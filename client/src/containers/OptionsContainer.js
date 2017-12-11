import React, {Component} from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import '../style/Options.css';
import {
    changeLocationSelect, changeMarkerMemberDisplay, changePinPointDisplay, recenterMap, updateMarkerGeoLocation,
    updateMarkerSelect,
    updateMarkersSelect
} from "../actions/opMap";
import {
    changeAddress, changeAddressEntry, changeAddressFormatted, changeNewPinPoint, changePinPoints,
    changePinPointToRemove,
    changeRdvModalVisibility, changeRmPpModalVisibility,
    changeSendingMode, changeSharing, createPinPoint, deletePinPoint, transmitSharingMode
} from "../actions/opOptions";
import GoogleMaps from '@google/maps';
import Modal from "react-bootstrap/es/Modal";
import FormGroup from "react-bootstrap/es/FormGroup";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import FormControl from "react-bootstrap/es/FormControl";
import Button from "react-bootstrap/es/Button";
import Datetime from "react-datetime";
import dateFormat from "dateformat";
import {hours} from "moment";
import fbDefaultImage from "../pictures/SMART_BOY_FB.jpg"
import {draw, getDrawingsGroup} from "../actions/opCanvas";
import {push} from "react-router-redux";

var ATLANTIC_OCEAN = {
    latitude: 29.532804,
    longitude: -55.491477
};

const INTERVAL = 5000;

var googleMapsClient = GoogleMaps.createClient({
    key: 'AIzaSyAz09vuKBf8P3_7nXx_DNSKwzY0toXGxYw'
});

var intervall = null;


class OptionsContainer extends Component {
    constructor(props) {
        super(props);
        this._handleAddressSearch = this._handleAddressSearch.bind(this);
        this._handleAddressChange = this._handleAddressChange.bind(this);
        this._geocodeAddress = this._geocodeAddress.bind(this);
        this._checkLocation = this._checkLocation.bind(this);
        this._processLocation = this._processLocation.bind(this);
        this._handlePositionSending = this._handlePositionSending.bind(this);
        this._handleConstantPositionSending = this._handleConstantPositionSending.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this._openPp = this._openPp.bind(this);
        this._closePp = this._closePp.bind(this);
        this._displayMarker = this._displayMarker.bind(this);
        this._reverseGeocodeAddress = this._reverseGeocodeAddress.bind(this);
        this._handlePinPointDescChange = this._handlePinPointDescChange.bind(this);
        this._handlePinPointDateChange = this._handlePinPointDateChange.bind(this);
        this._getValidationPinPoint = this._getValidationPinPoint.bind(this);
        this._getUserUrlPhoto = this._getUserUrlPhoto.bind(this);
        this._deletePinPoint = this._deletePinPoint.bind(this);
        this._handleModeDessin = this._handleModeDessin.bind(this);
        this._handleChangeSharing = this._handleChangeSharing.bind(this);
        this._showDessins = this._showDessins.bind(this);
        this._handlePinPointDisplayChange = this._handlePinPointDisplayChange.bind(this);
        this._handleMarkerMemberDisplayChange = this._handleMarkerMemberDisplayChange.bind(this);
        setInterval(this._checkLocation, INTERVAL);
    }

    _open() {
        this._reverseGeocodeAddress();
        let {pinPoint} = this.props.opOptions;
        var date = new Date();
        date = dateFormat(date, "yyyy-mm-dd hh:MM:ss");
        pinPoint.date = date;
        this.props.changeNewPinPoint(pinPoint);
        this.props.changeRdvModalVisibility();
    }

    _close() {
        this.props.changeRdvModalVisibility();
    }

    _openPp(pinPoint) {
        this.props.changePinPointToRemove(pinPoint);
        this.props.changeRmPpModalVisibility();
    }

    _closePp() {
        this.props.changeRmPpModalVisibility();
    }

    _displayMarker(lat, lng, event) {
        console.log(lat);
        console.log(lng);
        let point = {
            lat : lat,
            lng : lng
        };
        this.props.recenterMap(point, 15);
    }

    _convertDate(dateString) {
        var date = new Date(dateString);
        date = dateFormat(date, "yyyy-mm-dd hh:MM:ss");
        return date;
    }

    _handlePinPointDateChange(event) {
        let {pinPoint} = this.props.opOptions;
        var date = this._convertDate(event._d);
        pinPoint.date = date;
        this.props.changeNewPinPoint(pinPoint);
    }

    _handlePinPointDescChange(event) {
        let {pinPoint} = this.props.opOptions;
        pinPoint.desc = event.target.value;
        this.props.changeNewPinPoint(pinPoint);
    }

    _handlePinPointDisplayChange(event) {
        this.props.changePinPointDisplay();
    }

    _handleMarkerMemberDisplayChange(event) {
        this.props.changeMarkerMemberDisplay();
    }

    _getValidationPinPoint(event) {
        event.preventDefault();
        console.log(event);
        let pinPoint = {
            iduser : this.props.opLogin.idUser,
            idgroup : Number(this.props.opUsers.groupToDisplay),
            pinlg : this.props.opMap.markerSelect.lng,
            pinlt : this.props.opMap.markerSelect.lat,
            description : this.props.opOptions.pinPoint.desc,
            daterdv : this.props.opOptions.pinPoint.date
        }
        if(Number(this.props.opUsers.groupToDisplay) != 0) {
            this.props.createPinPoint(pinPoint, this.props.opLogin.idUser, Number(this.props.opUsers.groupToDisplay));
            this._close();
        }
    }

    _handlePositionSending(event) {
        this._checkLocation();

    }

    _handleConstantPositionSending(event) {
        if(!this.props.opOptions.isSharingPosition) {
            document.getElementById('markerBound').style.visibility='visible';
            intervall = setInterval(this._checkLocation, INTERVAL);
        } else {
            clearInterval(intervall);
            document.getElementById('markerBound').style.visibility='hidden';
        }
        this.props.changeSendingMode();
    }

    _handleChangeSharing(event){
        let {isSharing} = this.props.opOptions;
        let idUser = this.props.opLogin.idUser;
        let idGroup = this.props.opUsers.groupToDisplay;
        if(!!idGroup && idGroup !== "") {
            this.props.changeSharing(!isSharing);
            this.props.transmitSharingMode(!isSharing, idUser, idGroup)
        }
    }

    _checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._processLocation);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    _processLocation (location) {
        let point = {
            lat : location.coords.latitude,
            lng : location.coords.longitude
        };
        let pointArray = [point];
        let idUser = this.props.opLogin.idUser;
        this.props.updateMarkerGeoLocation(pointArray, idUser);
    }

    _handleAddressSearch(event) {
        if (event.key === 'Enter') {
            this._geocodeAddress();
        }
    }

    _handleAddressChange(event) {
        this.props.changeAddress(event.target.value);
    }

    _deletePinPoint() {
        this._closePp();
        this.props.deletePinPoint(this.props.opOptions.pinPointToRemove.id, this.props.opLogin.idUser, this.props.opUsers.groupToDisplay);
    }

    _geocodeAddress () {
        let {address} = this.props.opOptions;
        googleMapsClient.geocode({
            address: address
        }, function(err, response) {
            if (!err && response.json.status == "OK") {
                let position = response.json.results[0].geometry.location;
                let address = response.json.results[0].formatted_address;
                console.log(JSON.stringify(address));
                this.props.changeAddress(address, true);
                this.props.recenterMap(position, 15);
                this.props.updateMarkerSelect(position);
                return;
            }

            this.props.changeAddress(address, false);
            this.props.recenterMap({
                lat: ATLANTIC_OCEAN.latitude,
                lng: ATLANTIC_OCEAN.longitude
            }, 3);

            let marker= {
                lat: ATLANTIC_OCEAN.latitude,
                lng: ATLANTIC_OCEAN.longitude
            };

            this.props.updateMarkerSelect(marker);
        }.bind(this));
    }

    _getUserUrlPhoto(idUser) {
        let {users} = this.props.opUsers;
        let {friends} = this.props.opUsers;
        let allUsers = users.concat(friends);
        let user = null;
        user = allUsers.filter((obj) => {
            if(obj.iduser == idUser) {
                return true;
            } else {
                return false;
            }
        });

        if(user.length == 0) {
            return fbDefaultImage;
        }
        return user[0].urlPhoto;
    }

    _reverseGeocodeAddress () {
        let {markerSelect} = this.props.opMap;
        googleMapsClient.reverseGeocode({
            latlng: [markerSelect.lat, markerSelect.lng]
        }, function(err, response) {
            let address = "";
            let result = response.json.results;
            if (!err && response.json.status == "OK") {
                console.log(result);
                address = result[0].formatted_address;
                console.log(address);
                this.props.changeLocationSelect(address);
                return;
            }
            address = "Adresse non formalisable";
            this.props.changeLocationSelect(address);
        }.bind(this));
    }

    _handleModeDessin(event) {
        event.preventDefault();
        let boolean = this.props.opCanvas.draw;
        let idGroup = this.props.opUsers.groupToDisplay;
        console.log(idGroup);
        if(!boolean && idGroup !== '') {
            boolean = true;
        }
        else {
            boolean = false;
        }
        console.log(boolean);
        this.props.draw(boolean);
    }

    _showDessins(event) {
        event.preventDefault();
        this.props.getDrawingGroups(this.props.opLogin.idUser, this.props.opUsers.groupToDisplay);
    }

    render() {
        let {address} = this.props.opOptions;
        let {isSharingPosition} = this.props.opOptions;
        let {pinPoints} = this.props.opMap;
        let {markersMembers} = this.props.opMap;
        let {locationSelect} = this.props.opMap;
        let {isSharing} = this.props.opOptions;
        return (

            <div className='wrapper'>
                <input type='checkbox'/>
                <label id="search" htmlFor='pictures'>
                    <input type="text" id="fname" name="fname" placeholder="Entrez une adresse" value = {address}
                           onKeyPress={this._handleAddressSearch} onChange={this._handleAddressChange}/>
                </label>
                <input id='jobs' type='checkbox'/>
                    <label htmlFor='jobs'>
                        <p className ="accordion"><span className="ico"/>Partage</p>
                        <div className='lil_arrow'/>
                        <div className='content'>
                            <ul>
                                <li>
                                    <a href='#' onClick = {this._handleChangeSharing} className='sharePosition'>
                                        {isSharing? 'Partage activé' : 'Partage désactivé'}
                                    <i id= "markerBound" className="material-icons markerG"
                                       style={{visibility : (isSharing? "visible" : "hidden")}}>place</i>
                                    </a>
                                </li>
                                {markersMembers.map((marker) => (
                                    <li key={marker.iduser}>
                                        <a href='#' className='aMarkersMembers' onClick = {this._displayMarker.bind(this, marker.pos.lt, marker.pos.lg)}>
                                            <div className='liMarkersMembers'>
                                                <div className='imageMarkersMembers'>
                                                    <img className='profilFb' src={(this._getUserUrlPhoto(marker.iduser))} alt="photo de profil" height="60" width="60"/>
                                                </div>
                                                <div className='infoMarkersMembers'>
                                                    <div>{marker.firstname} {marker.lastname}</div>
                                                    <div>{this._convertDate(marker.date)}</div>
                                                </div>
                                                {(marker.current ? <div class="circle"></div> : "")}
                                            </div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <span/>
                    </label>
                <input id='financial' type='checkbox'/>
                    <label htmlFor='financial'>
                        <p className ="accordion"><span className="ico"/>Rendez-vous</p>
                        <div className='lil_arrow'/>
                        <div className='content'>
                            <ul>
                                 <li>
                                    <a href='#' onClick = {this._open}>Créer un rendez-vous</a>
                                </li>
                                {pinPoints.map((pinPoint) => (
                                    <li key={pinPoint.id}>
                                        <a href='#' className='aPinPoint' onClick = {this._displayMarker.bind(this, pinPoint.pos.lt, pinPoint.pos.lg)}>
                                            <div className='liPinPoint'>
                                                <div className='imagePinPoint'>
                                                    <img className='profilFb' src={(this._getUserUrlPhoto(pinPoint.idCreator))} alt="photo de profil" height="60" width="60"/>
                                                </div>
                                                <div className='infoPinPoint'>
                                                    <div>{(pinPoint.desc.length) > 20 ? pinPoint.desc.substring(0,20) + "..." : pinPoint.desc}</div>
                                                    <div>{this._convertDate(pinPoint.date)}</div>
                                                </div>
                                            </div>
                                        </a>
                                        <a href='#' className="menu-icon" onClick={this._openPp.bind(this, pinPoint)}>
                                            <div className="line top"></div>
                                            <div className="line right"></div>
                                            <div className="line bottom"></div>
                                            <div className="line left"></div>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <span/>
                    </label>
                <input id='events' type='checkbox'/>
                    <label htmlFor='events'>
                        <p className ="accordion"> <span className="ico"/>Filtres</p>
                        <div className='lil_arrow'/>
                        <div className='content'>
                            <ul>
                                <li>
                                    <a href='#' onClick = {this._handleMarkerMemberDisplayChange}> {(this.props.opMap.isMarkerShown ? "+ Positions" : "- Position")}</a>
                                </li>
                                <li>
                                <a href='#' onClick = {this._handlePinPointDisplayChange}>{(this.props.opMap.isPinPointShown ? "+ Rendez-vous" : "- Rendez-vous")}</a>
                                </li>
                                <li>
                                    <a onClick={this._showDessins}>Dessins</a>
                                </li>
                            </ul>
                        </div>
                        <span/>
                    </label>
                <input id='settings' type='checkbox'/>
                    <label htmlFor='settings'>
                        <p className ="accordion"><span className="ico"/>Dessins</p>
                        <div className='lil_arrow'/>
                        <div className='content'>
                        <ul>
                            <li>
                                <a onClick={this._handleModeDessin}>Mode dessin</a>
                            </li>
                        </ul>
                        </div>
                        <span/>
                    </label>
                <Modal show={this.props.opOptions.showModalRdv} onHide={this._close} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Création d'un rendez-vous</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this._getValidationPinPoint}>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <ControlLabel>Adresse</ControlLabel>
                                <FormControl
                                    readOnly
                                    type="text"
                                    placeholder={locationSelect}
                                />
                                <ControlLabel>Heure</ControlLabel>
                                <Datetime
                                    inputProps={{readOnly:true}}
                                    onChange={this._handlePinPointDateChange}
                                    defaultValue={new Date()}
                                    timeFormat="HH:mm"
                                />
                                <ControlLabel>Description</ControlLabel>
                                <FormControl
                                    type="text"
                                    onChange={this._handlePinPointDescChange.bind(this)}
                                />
                                <Button type="submit">Créer un rendez-vous</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>
                <Modal show={this.props.opOptions.showModalRmPp} onHide={this._closePp} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Voulez-vous supprimer ce rendez-vous ?</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button bsStyle="primary" onClick={this._deletePinPoint}>Oui</Button>
                            <Button bsStyle="danger" onClick={this._closePp}>Annuler</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

function mapStateToProps (state) {

    return{
        opOptions: state.opOptions,
        opMap : state.opMap,
        opUsers : state.opUsers,
        opLogin : state.opLogin,
        opGroups: state. opGroups,
        opCanvas: state.opCanvas
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        recenterMap: (mapCenter, zoom) => {
            dispatch(recenterMap(mapCenter, zoom))
        },
        changeAddress: (newAddress, validAddress) => {
            dispatch(changeAddress(newAddress, validAddress))
        },
        updateMarkerSelect: (newMarker) => {
            dispatch(updateMarkerSelect(newMarker))
        },
        updateMarkerGeoLocation: (markers, idUser) => {
            dispatch(updateMarkerGeoLocation(markers, idUser))
        },
        changeSendingMode: () => {
            dispatch(changeSendingMode())
        },
        changeRdvModalVisibility: () => {
            dispatch(changeRdvModalVisibility())
        },
        changeLocationSelect: (location) => {
            dispatch(changeLocationSelect(location))
        },
        changeNewPinPoint: (pinPoint) => {
            dispatch(changeNewPinPoint(pinPoint))
        },
        createPinPoint: (pinPoint, idUser, idGroup) => {
            dispatch(createPinPoint(pinPoint, idUser, idGroup))
        },
        changeRmPpModalVisibility:() => {
            dispatch(changeRmPpModalVisibility())
        },
        changePinPointToRemove:(pinPointToRemove) => {
            dispatch(changePinPointToRemove(pinPointToRemove))
        },
        deletePinPoint: (idPinPoint, idUser, idGroup) => {
            dispatch(deletePinPoint(idPinPoint, idUser, idGroup))
        },
        draw: (boolean) => {
            dispatch(draw(boolean));
        },
        changeSharing: (isSharing) => {
            dispatch(changeSharing(isSharing))
        },
        transmitSharingMode: (isSharing, idUser, idGroup) => {
            dispatch(transmitSharingMode(isSharing, idUser, idGroup))
        },
        getDrawingGroups: (idUser, idGroup) => {
            dispatch(getDrawingsGroup(idUser, idGroup));
            dispatch(push("/drawings"));
        },
        changeMarkerMemberDisplay: () => {
            dispatch(changeMarkerMemberDisplay())
        },
        changePinPointDisplay: () => {
            dispatch(changePinPointDisplay())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (OptionsContainer)