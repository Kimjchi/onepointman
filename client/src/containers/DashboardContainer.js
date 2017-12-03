import React, {Component} from 'react';
import {connect} from "react-redux";
import GroupsContainer from "./GroupsContainer";
import MapContainer from "./MapContainer";
import OptionsContainer from "./OptionsContainer";


class DashboardContainer extends Component {


    render() {
        return (
            <div>
                <OptionsContainer/>
                <GroupsContainer/>
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
