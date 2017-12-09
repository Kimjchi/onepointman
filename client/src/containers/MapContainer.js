import React, {Component} from 'react';
import {connect} from "react-redux";
import Map from "../components/Map";
import {
    changePinPoints, recenterMap, updateMarkerGeoLocation, updateMarkers, updateMarkerSelect,
    updateMarkersSelect
} from "../actions/opMap";


class MapContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isMarkerShown} = this.props.opMap;
        let {mapCenter} = this.props.opMap;
        let {zoom} = this.props.opMap;
        let {markerSelect} = this.props.opMap;
        let {markersGeoLocation} = this.props.opMap;
        let updateMarkerSelect = this.props.updateMarkerSelect;
        let {pinPoints} = this.props.opMap;
        let changePinPoints = this.props.changePinPoints;
        return (
            <Map isMarkerShown = {isMarkerShown} mapCenter = {mapCenter}
                 zoom = {zoom} updateMarkerSelect = {updateMarkerSelect}
                 markerSelect = {markerSelect} markersGeoLocation = {markersGeoLocation}
                 markersPinPoint = {pinPoints} changePinPoints = {changePinPoints}/>
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
        updateMarkerSelect: (newMarker) => {
            dispatch(updateMarkerSelect(newMarker))
        },
        changePinPoints: (pinPoints) => {
            dispatch(changePinPoints(pinPoints))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (MapContainer)