import React, {Component} from 'react';
import {connect} from "react-redux";
import MapContainer from "./MapContainer";


class DashboardContainer extends Component {


    render() {
        return (
            <div>
                <MapContainer/>
            </div>
        )
    }
}

function mapStateToProps (state) {

    return{
        opLogin: state.opLogin,
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{

    }
};

export default connect(mapStateToProps, mapDispatchToProps) (DashboardContainer)
