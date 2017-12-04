import React, {Component} from 'react';
import {connect} from "react-redux";
import Map from "../components/Map";
import {recenterMap, updateMarkers} from "../actions/opMap";


class MapContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isMarkerShown} = this.props.opMap;
        let {mapCenter} = this.props.opMap;
        let {zoom} = this.props.opMap;
        let {markers} = this.props.opMap;
        let updateMarkers = this.props.updateMarkers;
        return (
            <Map isMarkerShown = {isMarkerShown} mapCenter = {mapCenter}
                 zoom = {zoom} updateMarkers = {updateMarkers}  markers = {markers}/>
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
        updateMarkers: (markers) => {
            dispatch(updateMarkers(markers))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (MapContainer)