import React, {Component} from 'react';
import {  withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import GoogleMapsWrapper from "../util/GoogleMapsWrapper";

class Map extends Component {

    constructor(props) {
        super(props);
    }

    render()
    {
        return (
            <div>
                <GoogleMapsWrapper
                    googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                    loadingElement={<div style={{ height: '100%' }} />}
                    containerElement={<div style={{ height: '600px', width: '1200px' }} />}
                    mapElement={<div style={{ height: '100%' }} />}
                    defaultZoom={3}
                        defaultCenter={{ lat: -34.397, lng: 150.644 }}>
                        {this.props.isMarkerShown && <Marker position={{lat: -34.397, lng: 150.644}}/>}
                    </GoogleMapsWrapper>
            </div>
        )
    }
}

export default  Map;