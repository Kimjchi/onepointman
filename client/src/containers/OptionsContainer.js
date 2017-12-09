import React, {Component} from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import '../style/Options.css';
import {
    changeLocationSelect, recenterMap, updateMarkerGeoLocation, updateMarkerSelect,
    updateMarkersSelect
} from "../actions/opMap";
import {
    changeAddress, changeAddressEntry, changeAddressFormatted, changeNewPinPoint, changePinPoints,
    changeRdvModalVisibility,
    changeSendingMode, createPinPoint
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

var ATLANTIC_OCEAN = {
    latitude: 29.532804,
    longitude: -55.491477
};

const INTERVAL = 1000;

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
        this._displayPinPoint = this._displayPinPoint.bind(this);
        this._reverseGeocodeAddress = this._reverseGeocodeAddress.bind(this);
        this._handlePinPointDescChange = this._handlePinPointDescChange.bind(this);
        this._handlePinPointDateChange = this._handlePinPointDateChange.bind(this);
        this._getValidationPinPoint = this._getValidationPinPoint.bind(this);
        this._getUser = this._getUser.bind(this);
    }

    _open() {
        this.props.changeRdvModalVisibility();
        this._reverseGeocodeAddress();
    }

    _close() {
        this.props.changeRdvModalVisibility();
    }

    _displayPinPoint(lat, lng, event) {
        console.log(lat);
        console.log(lng);
        let point = {
            lat : lat,
            lng : lng
        };
        this.props.recenterMap(point, 15);
    }

    _handlePinPointDateChange(event) {
        let {pinPoint} = this.props.opOptions;
        var date = new Date(event._d);
        date = dateFormat(date, "yyyy-mm-dd hh:MM:ss");
        pinPoint.date = date;
        this.props.changeNewPinPoint(pinPoint);
    }

    _handlePinPointDescChange(event) {
        let {pinPoint} = this.props.opOptions;
        pinPoint.desc = event.target.value;
        this.props.changeNewPinPoint(pinPoint);
    }

    _getValidationPinPoint(event) {
        event.preventDefault();
        console.log(event);
        let pinPoint = {
            iduser : this.props.opLogin.idUser,
            idgroup : Number(this.props.opUser.groupToDisplay),
            pinlg : this.props.opMap.markerSelect.lng,
            pinlt : this.props.opMap.markerSelect.lat,
            description : this.props.opOptions.pinPoint.desc,
            daterdv : this.props.opOptions.pinPoint.date
        }
        console.log("Lolilol");
        if(Number(this.props.opUser.groupToDisplay) != 0) {
            //this.props.createPinPoint(pinPoint, this.props.opLogin.idUser, Number(this.props.opUser.groupToDisplay));
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
        this.props.updateMarkerGeoLocation(pointArray);
    }

    _handleAddressSearch(event) {
        if (event.key === 'Enter') {
            this._geocodeAddress();
        }
    }

    _handleAddressChange(event) {
        this.props.changeAddress(event.target.value);
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

    _getUser(idUser) {
        let {users} = this.props.opUser;
        let {friends} = this.props.opUser;
        let allUsers = users.concat(friends);
        let user = null;
        user = allUsers.filter((obj) => {
            if(obj.iduser == idUser) {
                return true;
            } else {
                return false;
            }
        });
        console.log(idUser);
        console.log(user);
        return user[0];
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

    render() {
        let {address} = this.props.opOptions;
        let {isSharingPosition} = this.props.opOptions;
        let {pinPoints} = this.props.opMap;
        let {locationSelect} = this.props.opMap;
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
                                    <a href='#' onClick = {this._handlePositionSending}>Evenementiel</a>
                                </li>
                                <li>
                                    <a href='#' onClick = {this._handleConstantPositionSending}>
                                    Continu
                                    <i id= "markerBound" className="material-icons markerG"
                                       style={{fontSize:"48px;color:red", visibility : (isSharingPosition? "visible" : "hidden")}}>place</i>
                                    </a>
                                </li>
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
                                        <a href='#' onClick = {this._displayPinPoint.bind(this, pinPoint.pos.lt, pinPoint.pos.lg)}>
                                            <img src={(this._getUser(pinPoint.idCreator)).urlPhoto} alt="photo de profil" height="70" width="70"/>
                                            <div>
                                                {pinPoint.date}
                                                {pinPoint.desc}
                                            </div>
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
                                    <a href='#'>Positions</a>
                                </li>
                                <li>
                                <a href='#'>Rendez-vous</a>
                                </li>
                                <li>
                                    <a href='#'>Dessins</a>
                                </li>
                            </ul>
                        </div>
                        <span/>
                    </label>
                <input id='settings' type='checkbox'/>
                    <label htmlFor='settings'>
                        <p className ="accordion"><span className="ico"/>Autre chose ?</p>
                        <div className='lil_arrow'/>
                        <div className='content'>
                        <ul>
                            <li>
                                <a href='#'>Man's not hot</a>
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
            </div>
        )
    }
}

function mapStateToProps (state) {

    return{
        opOptions: state.opOptions,
        opMap : state.opMap,
        opUser : state.opUsers,
        opLogin : state.opLogin
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
        updateMarkerGeoLocation: (markers) => {
            dispatch(updateMarkerGeoLocation(markers))
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
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (OptionsContainer)