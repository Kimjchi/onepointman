import React, {Component} from 'react';
import {connect} from "react-redux";
import GroupsContainer from "./GroupsContainer";


class DashboardContainer extends Component {


    render() {
        return (
            <div>
                <GroupsContainer/>
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
