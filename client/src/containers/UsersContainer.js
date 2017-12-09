import React, {Component} from 'react';
import {connect} from "react-redux";
import {addUser, changeSearch} from "../actions/opUsers";
import UsersComponent from "../components/UsersComponent";
import {getInfosGroup} from "../actions/opGroups";


class UsersContainer extends Component {


    render() {
        let {users, search, groupToDisplay} = this.props.opUsers;
        return (
            <UsersComponent users={users}
                            search={search}
                            groupToDisplay={groupToDisplay}
                            changeSearch={this.props.changeSearch}
                            addUser={this.props.addUser}/>
        )
    }
}

function mapStateToProps (state) {

    return{
        opUsers: state.opUsers,
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        addUser: (arrayUsers, idGroup) => {
            dispatch(addUser(arrayUsers, idGroup));
        },
        changeSearch: (newSearch) => {
            dispatch(changeSearch(newSearch));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (UsersContainer)
