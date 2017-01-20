import './hostCanvas.scss';

import React, { Component } from 'react';


export default class HostCanvas extends Component {

    constructor(props){
        super(props);
    }

    componentDidMount(){


    }

    render(){
        const width = window.innerWidth - 15;
        const height = window.innerHeight -15;
        return (
            <div className="host-wrapper">
                <div className="host-canvas-wrapper">
                <canvas className="host-canvas" ref="canvas" width={width} height={height}
                style={{background: 'url("/img/host-bg.png")'}}>
                </canvas>
                <div className="overlay">
                    TITLE
                </div>
                <div className="overlay2">
                    There are X players in current game
                </div>
                <img />

                <button className="btn btn-success start-game-button">
                    START GAME
                </button>

                </div>
            </div>

        )
    }


}






