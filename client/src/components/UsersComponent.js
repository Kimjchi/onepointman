import React, {Component} from 'react';
import {Button, ControlLabel, FormControl, FormGroup, Grid, Modal, PageHeader, Row} from 'react-bootstrap';
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
            <div className="text-centerUser">
                <ul id="navlist">
                    {
                        this.props.users.map((user, index) => {
                            return <li key={index}><a href="#">{user.nom}</a></li>
                        })
                    }
                    {
                        this.props.groupToDisplay && <i className="fa fa-plus fa-lg" style={{color: 'white'}} onClick={this._open}/>
                    }
                </ul>
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
            </div>
        )
    }
}

export default  UsersComponent;
