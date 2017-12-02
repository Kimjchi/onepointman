import React, {Component} from 'react';
import {connect} from "react-redux";
import LoginComponent from "../components/LoginComponent";
import {loginRequest} from "../actions/opLogin";


class LoginContainer extends Component {


    render() {
        return (
            <LoginComponent login={this.props.loginRequest}/>
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
        loginRequest: () => {
            dispatch(loginRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (LoginContainer)
