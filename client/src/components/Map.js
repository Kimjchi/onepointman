import React, {Component} from 'react';
import {  withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import GoogleMapsWrapper from "../util/GoogleMapsWrapper";
import '../style/Map.css';

const INTERVAL = 1000;
const LOCATION_ICON = "http://maps.google.com/mapfiles/ms/micons/blue-dot.png";

class Map extends Component {

    constructor(props) {
        super(props);
        this._checkLocation = this._checkLocation.bind(this);
        this._processLocation = this._processLocation.bind(this);
        setInterval(this._checkLocation, INTERVAL);
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
        this.props.updateMarkersGeolocation(pointArray);
    }

    render()
    {
        let id = 0;
        return (
            <div className="center">
                <GoogleMapsWrapper
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz09vuKBf8P3_7nXx_DNSKwzY0toXGxYw&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '100%'}} />}
                    mapElement={<div style={{ height: '100%' }} />}
                    zoom={this.props.zoom}
                    center={this.props.mapCenter}>
                        {this.props.isMarkerShown && this.props.markersGeoLocation.map(marker => (
                            <Marker
                                key={id++}
                                position={{ lat: marker.lat, lng: marker.lng }}
                                icon = {LOCATION_ICON}
                            />
                        ))}
                        {this.props.isMarkerShown && this.props.markers.map(marker => (
                            <Marker
                                key={id++}
                                position={{ lat: marker.lat, lng: marker.lng }}
                            />
                        ))}

                    </GoogleMapsWrapper>
            </div>
        )
    }
}

export default  Map;