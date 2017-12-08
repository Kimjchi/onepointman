import React, {Component} from 'react';
import {Button, ControlLabel, FormControl, FormGroup, Grid, Modal, PageHeader, Row} from 'react-bootstrap';
import '../style/Groups.css';

class GroupsComponent extends Component {
    constructor(props) {
        super(props);
        this._addGroup = this._addGroup.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this._getValidation = this._getValidation.bind(this);
        this._handleChange =  this._handleChange.bind(this);
        this._displayUsers = this._displayUsers.bind(this);
        this.state = {
            showModal: false
        }
    }

    _addGroup() {
        let array = this.props.groups;
        array.push({nom: this.props.groupName});
        this.props.addGroup(array);
    }

    _open() {
        this.setState({ showModal: true });
    }

    _close() {
        this.setState({ showModal: false });
    }

    _getValidation(event) {
        event.preventDefault();
        const length = this.props.groupName.length;
        if (length > 0) {
            this._addGroup();
            this._close();
        }
        else if (length === 0) {
            return 'error';
        }
    }

    _handleChange(event) {
        this.props.changeGroupName(event.target.value);
    }

    _displayUsers(event) {
        let users = this.props.groups;
        let usersToDisplay = users.filter(group => {
            return group.idgroup === parseInt(event.target.id, 10);
        });
        if(usersToDisplay.length === 0) {
            this.props.addUser([], event.target.id);
        }
        else {
            this.props.addUser(usersToDisplay[0].membres, event.target.id);
        }
    }

    _checkLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this._processLocation);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    _processLocation (location) {
        let point = {
            lat : location.coords.latitude,
            lng : location.coords.longitude
        };
        let pointArray = [point];
        this.props.updateMarkersGeolocation(pointArray);
    }

    render() {
        return (
            <div id="menuToggle">

                <input type="checkbox" />


                <span/>
                <span/>
                <span/>

                <ul id="menu">
                    {
                        this.props.groups.map((group, index) => {
                            return <a key={index}><li onClick={this._displayUsers} id={group.idgroup}>{group.nomgroup}</li></a>
                        })
                    }
                    <i className="fa fa-plus fa-lg" style={{color: '#232323'}} onClick={this._open}/>
                </ul>
                <Modal show={this.state.showModal} onHide={this._close} className="moddal">
                    <Modal.Header closeButton>
                        <Modal.Title>Création d'un groupe</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <form onSubmit={this._getValidation}>
                            <FormGroup
                                controlId="formBasicText"
                            >
                                <ControlLabel>Nom du groupe</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.props.groupName}
                                    onChange={this._handleChange}
                                />
                                <FormControl.Feedback />
                                <Button type="submit">Créer un groupe</Button>
                            </FormGroup>
                        </form>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default  GroupsComponent;
