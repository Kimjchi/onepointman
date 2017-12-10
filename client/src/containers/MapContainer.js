import React, {Component} from 'react';
import {connect} from "react-redux";
import Map from "../components/Map";
import {
    changeMap,
    changePinPoints, recenterMap, updateMarkerGeoLocation, updateMarkerMembers, updateMarkers, updateMarkerSelect,
    updateMarkersSelect
} from "../actions/opMap";


class MapContainer extends Component {
    constructor(props) {
        super(props);
        this._onMapMounted = this._onMapMounted.bind(this);
        this._onIdleChanged = this._onIdleChanged.bind(this);
    }

    _onMapMounted(mapRef) {
        this.props.changeMap(mapRef);
    }

    _onIdleChanged(){
        if(!!this.props.opMap.map) {
            let zoom = this.props.opMap.map.getZoom();
            let center = this.props.opMap.map.getCenter();
            if(this.props.opMap.zoom != zoom || this.props.opMap.mapCenter.lat != center.lat() || this.props.opMap.mapCenter.lng != center.lng()) {
                let centerPoint = {lat : center.lat(), lng : center.lng()};
                this.props.recenterMap(centerPoint, zoom);
            }
        }
    }

    render() {
        let {isMarkerShown} = this.props.opMap;
        let {mapCenter} = this.props.opMap;
        let {zoom} = this.props.opMap;
        let {markerSelect} = this.props.opMap;
        let {markersGeoLocation} = this.props.opMap;
        let {markersMembers} = this.props.opMap;
        let updateMarkerSelect = this.props.updateMarkerSelect;
        let updateMarkerMembers = this.props.updateMarkerMembers;
        let {pinPoints} = this.props.opMap;
        let changePinPoints = this.props.changePinPoints;
        return (
            <Map isMarkerShown = {isMarkerShown} mapCenter = {mapCenter}
                 zoom = {zoom} updateMarkerSelect = {updateMarkerSelect}
                 markerSelect = {markerSelect} markersGeoLocation = {markersGeoLocation}
                 markersPinPoint = {pinPoints} changePinPoints = {changePinPoints}
                 _onMapMounted = {this._onMapMounted} _onIdleChanged = {this._onIdleChanged}
                 markersMembers = {markersMembers} updateMarkerMembers = {updateMarkerMembers}/>
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
        },
        changeMap: (map) => {
            dispatch(changeMap(map))
        },
        recenterMap: (mapCenter, zoom) => {
            dispatch(recenterMap(mapCenter, zoom))
        },
        updateMarkerMembers: (markers) => {
            dispatch(updateMarkerMembers(markers))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (MapContainer)