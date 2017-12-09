import React, {Component} from 'react';
import ArtCanvas from 'art-canvas/build/ArtCanvas';

class CanvasComponent extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let canvas    =  document.getElementById('canvas');
        let container = canvas.parentNode;
        let width     = 600;  // px
        let height    = 600;  // px

        // Create the instance of ArtCanvas
        let artCanvas = new ArtCanvas.constructor(container, canvas, width, height);
    }

    render() {
        return (
            <div id="container-canvas">
                <div id="canvas"/>
            </div>
        )
    }
}

export default (CanvasComponent)
