import React, {Component} from 'react';
import {Button, Grid, Modal, PageHeader, Row} from 'react-bootstrap';
import '../style/Groups.css';

class GroupsComponent extends Component {
    constructor(props) {
        super(props);
        this._addGroup = this._addGroup.bind(this);
        this._open = this._open.bind(this);
        this._close = this._close.bind(this);
        this.state = {
            showModal: false
        }
    }

    _addGroup() {

    }

    _open() {
        this.setState({ showModal: true });
    }

    _close() {
        this.setState({ showModal: false });
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
                        this.props.groupes.map((groupe, index) => {
                            return <a href="#" key={index}><li>{groupe.nom}</li></a>
                        })
                    }
                    <i className="fa fa-plus fa-lg" style={{color: '#232323'}} onClick={this._open}/>
                </ul>
                <Modal show={this.state.showModal} onHide={this.close}>
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h4>Text in a modal</h4>
                        <p>Duis mollis, est non commodo luctus, nisi erat porttitor ligula.</p>

                        <hr />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this._close}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default  GroupsComponent;
