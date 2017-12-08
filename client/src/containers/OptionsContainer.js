import React, {Component} from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import '../style/Options.css';
import {recenterMap, updateMarkerGeoLocation, updateMarkersSelect} from "../actions/opMap";
import {
    changeAddress, changeAddressEntry, changeAddressFormatted, changeRdvModalVisibility,
    changeSendingMode
} from "../actions/opOptions";
import GoogleMaps from '@google/maps';
import Modal from "react-bootstrap/es/Modal";
import FormGroup from "react-bootstrap/es/FormGroup";
import ControlLabel from "react-bootstrap/es/ControlLabel";
import FormControl from "react-bootstrap/es/FormControl";
import Button from "react-bootstrap/es/Button";

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
    }

    _open() {
        this.props.changeRdvModalVisibility();
    }

    _close() {
        this.props.changeRdvModalVisibility();
    }

    _getValidation(event) {
        event.preventDefault();
        console.log("Lolilol");
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
            console.log(response);
            console.log(err);
            if (!err) {
                let position = response.json.results[0].geometry.location;
                let address = response.json.results[0].formatted_address;
                console.log(JSON.stringify(address));
                this.props.changeAddress(address, true);
                this.props.recenterMap(position, 15);
                let markersArray = [position];
                this.props.updateMarkersSelect(markersArray);
                return;
            }

            this.props.changeAddress(address, false);
            this.props.recenterMap({
                lat: ATLANTIC_OCEAN.latitude,
                lng: ATLANTIC_OCEAN.longitude
            }, 3);

            let markersArray = [{
                lat: ATLANTIC_OCEAN.latitude,
                lng: ATLANTIC_OCEAN.longitude
            }];

            this.props.updateMarkersSelect(markersArray);
        }.bind(this));
    }

    render() {
        let {address} = this.props.opOptions;
        let {isSharingPosition} = this.props.opOptions;
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
                                <li>
                                    <a href='#'>Heure</a>
                                </li>
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
                        <form onSubmit={this._getValidation}>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <ControlLabel>Heure</ControlLabel>
                                <FormControl
                                    type="text"
                                />
                                <FormControl.Feedback />
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
        opOptions: state.opOptions
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
        updateMarkersSelect: (newMarkers) => {
            dispatch(updateMarkersSelect(newMarkers))
        },
        updateMarkerGeoLocation: (markers) => {
            dispatch(updateMarkerGeoLocation(markers))
        },
        changeSendingMode: () => {
            dispatch(changeSendingMode())
        },
        changeRdvModalVisibility: () => {
            dispatch(changeRdvModalVisibility())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (OptionsContainer)