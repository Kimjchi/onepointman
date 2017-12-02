import React, {Component} from 'react';
import {connect} from "react-redux";
import {addGroup, changeFormGroups} from "../actions/opGroups";
import GroupsComponent from "../components/GroupsComponent";


class GroupsContainer extends Component {


    render() {
        let {groupes} = this.props.opGroups;
        return (
            <GroupsComponent groupes={groupes}
                             addGroup={this.props.addGroup}/>
        )
    }
}

function mapStateToProps (state) {

    return{
        opGroups: state.opGroups,
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
        changeFormGroups: (newFormState) => {
            dispatch(changeFormGroups(newFormState));
        },
        addGroup: (arrayGroups) => {
            dispatch(addGroup(arrayGroups));
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (GroupsContainer)
