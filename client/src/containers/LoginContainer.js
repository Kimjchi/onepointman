import React, {Component} from 'react';
import {connect} from "react-redux";
import LoginComponent from "../components/LoginComponent";


class LoginContainer extends Component {


    render() {
        return (
            <LoginComponent/>
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

export default connect(mapStateToProps, mapDispatchToProps) (LoginContainer)
