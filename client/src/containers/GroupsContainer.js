import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeNomGroupe} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";
import {addUser} from "../actions/opUsers";


class GroupsContainer extends Component {


    render() {
        let {groupes, nomGroupe} = this.props.opGroups;
        let {groupesUsers} = this.props.opUsers;
        return (
            <GroupsComponent groupes={groupes}
                             nomGroupe={nomGroupe}
                             groupesUsers={groupesUsers}
                             changeNomGroupe={this.props.changeNomGroupe}
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
        changeNomGroupe: (nomGroupe) => {
            dispatch(changeNomGroupe(nomGroupe));
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
