import React, {Component} from 'react';
import {connect} from "react-redux";
import LoginComponent from "../components/LoginComponent";
import {loginRequest} from "../actions/opLogin";
import openSocket from 'socket.io-client';


class LoginContainer extends Component {

    constructor(props) {
        super(props);

        //TODO: establish websocket connection
        const  socket = openSocket('http://localhost:3002');

        socket.on('Notification', (data) => {
            alert(data);
        });
    }

    render() {
        return (
            <LoginComponent login={this.props.loginRequest}/>
        )
    }
}

function mapStateToProps(state) {

    return {
        opLogin: state.opLogin,
    }
}

//fonctions
const mapDispatchToProps = (dispatch) => {
    return {
        loginRequest: () => {
            dispatch(loginRequest())
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
