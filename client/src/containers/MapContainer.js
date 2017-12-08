import React, {Component} from 'react';
import {connect} from "react-redux";
import Map from "../components/Map";
import {recenterMap, updateMarkerGeoLocation, updateMarkers, updateMarkersSelect} from "../actions/opMap";


class MapContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isMarkerShown} = this.props.opMap;
        let {mapCenter} = this.props.opMap;
        let {zoom} = this.props.opMap;
        let {markersSelect} = this.props.opMap;
        let {markersGeoLocation} = this.props.opMap;
        let updateMarkersSelect = this.props.updateMarkersSelect;
        return (
            <Map isMarkerShown = {isMarkerShown} mapCenter = {mapCenter}
                 zoom = {zoom} updateMarkersSelect = {updateMarkersSelect}
                 markersSelect = {markersSelect} markersGeoLocation = {markersGeoLocation} />
    )
    }
}

function mapStateToProps (state) {

    return{
        opMap: state.opMap,
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        updateMarkersSelect: (newMarkers) => {
            dispatch(updateMarkersSelect(newMarkers))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (MapContainer)