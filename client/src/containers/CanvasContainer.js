import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeGroupName, getGroups, getInfosGroup} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";
import CanvasComponent from "../components/CanvasComponent";


class CanvasContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        return (
            <CanvasComponent/>
        )
    }
}

function mapStateToProps (state) {

    return{

        opLogin: state.opLogin
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (CanvasContainer)
