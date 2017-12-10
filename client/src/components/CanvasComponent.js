import {SketchField, Tools, ContentUndo} from 'react-sketch';
import React, {Component} from 'react';
import dataUrl from './data.url';
import dataJson from './data.json';

class CanvasComponent extends React.Component {
    constructor(props) {
        super(props);
        this._undo = this._undo.bind(this);
        this._redo = this._redo.bind(this);
        this.state = {
            drawings: [],
            canUndo: false,
            canRedo: false,
        };
    }
    _undo = () => {
        this._sketch.undo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };
    _redo = () => {
        this._sketch.redo();
        this.setState({
            canUndo: this._sketch.canUndo(),
            canRedo: this._sketch.canRedo()
        })
    };
    render() {
        return (
            <div>
                <SketchField width='1440px'
                             height='768px'
                             tool={Tools.Pencil}
                             color='black'
                             ref={(c) => this._sketch = c}
                             defaultValue={dataJson}
                             lineWidth={3}/>
                <button onClick={this._undo} style={{position: 'absolute', bottom: 0, left: '800px'}}>UNDO</button>
                <button onClick={this._redo} style={{ position: 'absolute', bottom: 0, left: '900px'}}>REDO</button>
            </div>
        )
    }
}

export default CanvasComponent;