import React, {Component} from 'react';
import {withGoogleMap, GoogleMap, Marker, InfoWindow} from "react-google-maps"
import GoogleMapsWrapper from "../util/GoogleMapsWrapper";
import '../style/Map.css';

const INTERVAL = 1000;
const LOCATION_ICON = "http://maps.google.com/mapfiles/ms/micons/blue-dot.png";
const PINPOINT_ICON = "http://maps.google.com/mapfiles/ms/micons/yellow-dot.png";

class Map extends Component {

    constructor(props) {
        super(props);
        this._onClickMap = this._onClickMap.bind(this);
        this._handleClicMarker = this._handleClicMarker.bind(this);
    }

    _handleClicMarker (marker) {
        var index = this.props.markersPinPoint.indexOf(marker);
        let newState =  this.props.markersPinPoint;
        marker.showInfo = !marker.showInfo;
        if (index !== -1) {
            newState[index] = marker;
        }
        this.props.changePinPoints(newState);
    }

    _onClickMap (event) {
        let coordinates = event.latLng;
        let lat = coordinates.lat();
        let lng = coordinates.lng();
        let marker = {
            lat: lat,
            lng: lng
        };
       this.props.updateMarkerSelect(marker);
    }

    render()
    {
        let id = 0;
        let markerSelect = this.props.markerSelect;
        return (
            <div className="center">
                <GoogleMapsWrapper
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz09vuKBf8P3_7nXx_DNSKwzY0toXGxYw&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '100%'}} />}
                    mapElement={<div style={{ height: '100%' }} />}
                    zoom={this.props.zoom}
                    center={this.props.mapCenter}
                    onClick={this._onClickMap}>
                        {this.props.isMarkerShown && this.props.markersGeoLocation.map(marker => (
                            <Marker
                                key={id++}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                icon = {LOCATION_ICON}
                            />
                        ))}
                        {this.props.isMarkerShown &&
                            <Marker
                                key={id++}
                                position={{ lat: markerSelect.lat, lng: markerSelect.lng }}
                            />
                        }
                        {this.props.isMarkerShown && this.props.markersPinPoint.map(marker => (
                            <Marker
                                key={id++}
                                position={{ lat: marker.pos.lt, lng: marker.pos.lg }}
                                icon = {PINPOINT_ICON}
                                onClick={this._handleClicMarker.bind(this, marker)}
                            >
                                {marker.showInfo && <InfoWindow onCloseClick={this._handleClicMarker.bind(this, marker)}>
                                    <div className='divMarker'>
                                        {marker.desc}
                                    </div>
                                </InfoWindow>}
                            </Marker>
                        ))}

                    </GoogleMapsWrapper>
            </div>
        )
    }
}

export default  Map;