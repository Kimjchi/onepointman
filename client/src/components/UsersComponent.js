import React, {Component} from 'react';
import {Button, Col, ControlLabel, FormControl, FormGroup, Grid, Modal, PageHeader, Row} from 'react-bootstrap';
import '../style/Users.css';

class UsersComponent extends Component {
    constructor(props) {
        super(props);
        this._addUser = this._addUser.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this._handleChange =  this._handleChange.bind(this);
        this.state = {
            showModal: false
        }
    }

    _addUser() {
        let array = this.props.groupes;
        array.push({nom: this.props.nomGroupe});
        this.props.addUser(array);
    }

    _open() {
        this.setState({ showModal: true });
    }

    _close() {
        this.setState({ showModal: false });
    }

    _handleChange(event) {
        this.props.changeSearch(event.target.value);
    }

    render() {
        return (
            <Row className="text-centerUser show-grid">
                <Col md={10}>
                    <ul id="navlist">
                        {
                            this.props.users.map((user, index) => {
                                if(user.urlPhoto) {
                                    return <li key={index}><img src={user.urlPhoto} alt="photo de profil" height="70" width="70"/></li>
                                }
                            })
                        }
                    </ul>
                </Col>
                    {
                        this.props.groupToDisplay && <Col md={2}><i className="fa fa-plus fa-2x addButton" style={{color: 'white'}} onClick={this._open}/></Col>
                    }
                <Modal show={this.state.showModal} onHide={this._close} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Ajout d'un membre</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <ControlLabel>Chercher un ami</ControlLabel>
                                <FormControl
                                    type="text"
                                    onChange={this._handleChange}
                                />
                                <FormControl.Feedback />
                                <Button type="submit">Ajouter dans le groupe</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>
            </Row>
        )
    }
}

export default  UsersComponent;
