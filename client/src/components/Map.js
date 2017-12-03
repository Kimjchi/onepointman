import React, {Component} from 'react';
import {  withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import GoogleMapsWrapper from "../util/GoogleMapsWrapper";
import '../style/Map.css';

class Map extends Component {

    constructor(props) {
        super(props);
    }

    render()
    {
        return (
            <div className="center">
                <GoogleMapsWrapper
                    googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAz09vuKBf8P3_7nXx_DNSKwzY0toXGxYw&v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '100%'}} />}
                    mapElement={<div style={{ height: '100%' }} />}
                    zoom={this.props.zoom}
                    center={this.props.mapCenter}>
                        {this.props.isMarkerShown && this.props.markers.map(marker => (
                            <Marker
                                key={marker.id}
                                position={{ lat: marker.lat, lng: marker.lng }}
                            />
                        ))}

                    </GoogleMapsWrapper>
            </div>
        )
    }
}

export default  Map;