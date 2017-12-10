import React, {Component} from 'react';
import {connect} from "react-redux";
import GroupsContainer from "./GroupsContainer";
import MapContainer from "./MapContainer";
import OptionsContainer from "./OptionsContainer";
import UsersContainer from "./UsersContainer";
import CanvasContainer from "./CanvasContainer";


class DashboardContainer extends Component {


    render() {
        console.log(this.props.opCanvas.draw);
        return (
            <div>
                <OptionsContainer/>
                <UsersContainer/>
                <MapContainer/>
                <GroupsContainer/>
                {
                    this.props.opCanvas.draw && <CanvasContainer/>
                }

            </div>
        )
    }
}

function mapStateToProps (state) {

    return{
        opLogin: state.opLogin,
        opCanvas: state.opCanvas,
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (DashboardContainer)
