import React, {Component} from 'react';
import {connect} from "react-redux";
import GroupsContainer from "./GroupsContainer";
import MapContainer from "./MapContainer";
import {Grid, PageHeader, Row} from "react-bootstrap";
import UsersContainer from "./UsersContainer";


class DashboardContainer extends Component {


    render() {
        return (
            <Grid>
                <Row className="show-grid">
                    <PageHeader className="text-center">OnePointMan</PageHeader>
                </Row>
                <GroupsContainer/>
                <Row className="show-grid">
                    <UsersContainer/>
                </Row>
                <Row className="show-grid">
                    {
                        <MapContainer/>
                    }
                </Row>
            </Grid>
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
