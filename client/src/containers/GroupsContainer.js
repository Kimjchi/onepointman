import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeGroupName} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";


class GroupsContainer extends Component {


    render() {
        let {groups, groupName} = this.props.opGroups;
        let {groupsUsers} = this.props.opUsers;
        return (
            <GroupsComponent groups={groups}
                             groupName={groupName}
                             groupsUsers={groupsUsers}
                             changeGroupName={this.props.changeGroupName}
                             addGroup={this.props.addGroup}
                             addUser={this.props.addUser}
            />
        )
    }
}

function mapStateToProps (state) {

    return{
        opGroups: state.opGroups,
        opUsers: state.opUsers
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
        addUser: (arrayUsers, idGroup) => {
            dispatch(addUser(arrayUsers, idGroup));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GroupsContainer)
