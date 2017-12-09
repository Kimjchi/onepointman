import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeGroupName, getGroups, getInfosGroup} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";


class GroupsContainer extends Component {
    constructor(props) {
        super(props);
        this.props.getGroups(this.props.opLogin.idUser);
    }

    render() {
        let {groups, groupName} = this.props.opGroups;
        let {groupsUsers} = this.props.opUsers;
        let {urlPhoto, idUser} = this.props.opLogin;
        return (
            <GroupsComponent groups={groups}
                             groupName={groupName}
                             groupsUsers={groupsUsers}
                             getInfosGroup={this.props.getInfosGroup}
                             changeGroupName={this.props.changeGroupName}
                             addGroup={this.props.addGroup}
                             addUser={this.props.addUser}
                             idUser={idUser}
                             photoUser={urlPhoto}
            />
        )
    }
}

function mapStateToProps (state) {

    return{
        opGroups: state.opGroups,
        opUsers: state.opUsers,
        opLogin: state.opLogin
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        changeGroupName: (groupName) => {
            dispatch(changeGroupName(groupName));
        },
        addGroup: (arrayGroups) => {
            dispatch(addGroup(arrayGroups));
        },
        addUser: (arrayUsers, idGroup, idUser) => {
            dispatch(addUser(arrayUsers, idGroup));
            dispatch(getInfosGroup(idUser, idGroup));
        },
        getGroups: (idUser) => {
            dispatch(getGroups(idUser));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GroupsContainer)
