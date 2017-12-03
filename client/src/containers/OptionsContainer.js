import React, {Component} from 'react';
import {connect} from "react-redux";
import ReactDOM from 'react-dom';
import '../style/Options.css';
import {recenterMap} from "../actions/opMap";
import {changeAddress, changeAddressEntry, changeAddressFormatted} from "../actions/opOptions";
import GoogleMaps from '@google/maps';

var ATLANTIC_OCEAN = {
    latitude: 29.532804,
    longitude: -55.491477
};

var googleMapsClient = GoogleMaps.createClient({
    key: 'AIzaSyAz09vuKBf8P3_7nXx_DNSKwzY0toXGxYw'
});


class OptionsContainer extends Component {
    constructor(props) {
        super(props);
        this._handleAddressSearch = this._handleAddressSearch.bind(this);
        this._handleAddressChange = this._handleAddressChange.bind(this);
        this._geocodeAddress = this._geocodeAddress.bind(this);
    }

    _handleAddressSearch(event) {
        if (event.key === 'Enter') {
            this._geocodeAddress(event);
            //this.props.recenterMap({ lat: -36.397, lng: 150.644 });
        }
    }

    _handleAddressChange(event) {
        this.props.changeAddress(event.target.value);
    }

    _geocodeAddress (event) {
        let {address} = this.props.opOptions;
        googleMapsClient.geocode({
            address: address
        }, function(err, response) {
            if (!err) {
                console.log(JSON.stringify(response.json.results[0].formatted_address));
                //foundAddress: results[0].formatted_address,
                //isGeocodingError: false
                this.props.changeAddress(response.json.results[0].formatted_address);
                this.props.recenterMap(response.json.results[0].geometry.location, 15);
                //this.marker.setPosition(results[0].geometry.location);

                return;
            }
            /*this.setState({
            foundAddress: null,
            isGeocodingError: true
            });*/

            this.props.recenterMap({
                lat: ATLANTIC_OCEAN.latitude,
                lng: ATLANTIC_OCEAN.longitude
            }, 3);

            /*this.marker.setPosition({
                lat: ATLANTIC_OCEAN.latitude,
                lng: ATLANTIC_OCEAN.longitude
            });*/
        }.bind(this));
    }

    render() {
        let {address} = this.props.opOptions;
        return (

            <div className='wrapper'>
                <input type='checkbox'/>
                    <label id="search" htmlFor='pictures'>
                        <input type="text" id="fname" name="fname" placeholder="Entrez une adresse" value = {address}
                               onKeyPress={this._handleAddressSearch} onChange={this._handleAddressChange}/>
                    </label>
                    <input id='jobs' type='checkbox'/>
                        <label htmlFor='jobs'>
                            <p className ="accordion"><span className="ico"></span>Partage</p>
                            <div className='lil_arrow'></div>
                            <div className='content'>
                                <ul>
                                    <li>
                                        <a href='#'>Evenementiel</a>
                                    </li>
                                    <li>
                                        <a href='#'>Continu</a>
                                    </li>
                                </ul>
                            </div>
                            <span></span>
                        </label>
                        <input id='financial' type='checkbox'/>
                        <label htmlFor='financial'>
                            <p className ="accordion"><span className="ico"></span>Rendez-vous</p>
                            <div className='lil_arrow'></div>
                            <div className='content'>
                                <ul>
                                    <li>
                                        <a href='#'>Adresse</a>
                                    </li>
                                    <li>
                                        <a href='#'>Heure</a>
                                    </li>
                                </ul>
                            </div>
                            <span></span>
                        </label>
                        <input id='events' type='checkbox'/>
                            <label htmlFor='events'>
                                <p className ="accordion"> <span className="ico"></span>Filtres</p>
                                <div className='lil_arrow'></div>
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
                                <span></span>
                            </label>
                                <input id='settings' type='checkbox'/>
                                    <label htmlFor='settings'>
                                        <p className ="accordion"><span className="ico"></span>Autre chose ?</p>
                                        <div className='lil_arrow'></div>
                                        <div className='content'>
                                            <ul>
                                                <li>
                                                    <a href='#'>Man's not hot</a>
                                                </li>
                                            </ul>
                                        </div>
                                        <span></span>
                                    </label>
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
        changeAddress: (newAddress) => {
            dispatch(changeAddress(newAddress))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (OptionsContainer)