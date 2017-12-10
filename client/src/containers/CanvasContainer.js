import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeGroupName, getGroups, getInfosGroup} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";
import CanvasComponent from "../components/CanvasComponent";
import {changeDescription, sendDrawing, setDrawings} from "../actions/opCanvas";
import {push} from "react-router-redux";

class CanvasContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {drawings, description} = this.props.opCanvas;
        let {idUser} = this.props.opLogin;
        let {groupToDisplay} = this.props.opUsers;
        let {mapCenter, zoom} = this.props.opMap;
        return (
            <CanvasComponent setDrawings={this.props.setDrawings}
                             drawing={drawings}
                             description={description}
                             idUser={idUser}
                             groupToDisplay={groupToDisplay}
                             mapCenter={mapCenter}
                             zoom={zoom}
                             sendDrawing={this.props.sendDrawing}
                             changeDescription={this.props.changeDescription}
            />
        )
    }
}

function mapStateToProps (state) {

    return{

        opLogin: state.opLogin,
        opCanvas: state.opCanvas,
        opUsers: state.opUsers,
        opMap: state.opMap
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        setDrawings: (drawings) => {
            dispatch(setDrawings(drawings));
            //dispatch(push("/drawings"))
        },
        changeDescription: (description) => {
            dispatch(changeDescription(description))
        },
        sendDrawing:(drawing, idUser, idGroup, description, zoom, center) => {
            dispatch(sendDrawing(drawing, idUser, idGroup, description, zoom, center))
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (CanvasContainer)