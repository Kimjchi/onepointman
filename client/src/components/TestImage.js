import {SketchField, Tools, ContentUndo} from 'react-sketch';
import React, {Component} from 'react';
import {connect} from "react-redux";

class TestImage extends React.Component {
    render() {
        let {drawings} = this.props.opCanvas;
        return (
            <div>
                {
                    drawings.map(drawing => {
                        return <img src={drawing} height={500} width={500} style={{zIndex: 20}}/>
                    })
                }
            </div>
        )
    }
}

function mapStateToProps (state) {

    return{

        opLogin: state.opLogin,
        opCanvas: state.opCanvas
    }
}

//fonctions
const  mapDispatchToProps = (dispatch) => {
    return{
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (TestImage)