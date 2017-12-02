import React, {Component} from 'react';
import {connect} from "react-redux";
import Map from "../components/Map";


class MapContainer extends Component {


    render() {
        return (
            <Map isMarkerShown = {true}/>
    )
    }
}

function mapStateToProps (state) {

    return{
        opState: state.opMap,
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (MapContainer)