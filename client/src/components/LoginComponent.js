import React, {Component} from 'react';
import {Button, Grid, PageHeader, Row} from 'react-bootstrap';
import '../style/Login.css';

class LoginComponent extends Component {
    constructor(props) {
        super(props);
        this._handleLogin = this._handleLogin.bind(this);
    }

    _handleLogin() {
        this.props.login();
    }

    render() {
        return (
            <Grid className="loginPage">
                <Row className="show-grid">
                    <PageHeader className="text-center">OnePointMan</PageHeader>
                </Row>
                <Row className="show-grid text-center">
                        <Button bsSize="large" onClick={this._handleLogin}>Login</Button>
                </Row>
            </Grid>
        )
    }
}

export default  LoginComponent;
