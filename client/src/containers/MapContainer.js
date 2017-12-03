import React, {Component} from 'react';
import {connect} from "react-redux";
import Map from "../components/Map";
import {loginRequest} from "../actions/opLogin";
import {recenterMap} from "../actions/opMap";


class MapContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {isMarkerShown} = this.props.opMap;
        let {mapCenter} = this.props.opMap;
        let {zoom} = this.props.opMap;
        return (
            <Map isMarkerShown = {isMarkerShown} mapCenter = {mapCenter} zoom = {zoom} />
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
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (MapContainer)