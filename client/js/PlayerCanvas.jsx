import './playerCanvas.scss';

import React, { Component } from 'react';

export default class PlayerCanvas extends Component {

    constructor(props){
        super(props);

        this.updateCanvas = this.updateCanvas.bind(this);
    }

    componentDidMount(){


        this.updateCanvas();
        //adds a event listener to listen for any browser resizing
        window.addEventListener('resize', this.updateCanvas, false);

    }

    updateCanvas() {
        console.log('UPDATE CANVAS');
        const ctx = this.refs.canvas.getContext('2d');
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight - 50;
    }

    render() {
        return (
            <div className="player-wrapper">
            <div className="player-message-container">Player Name however long they want</div>
            <div className="player-prompt-container"> Prompt Message for player instructions </div>
                <div className="player-canvas-wrapper">
                <canvas className="player-canvas" ref="canvas" >
                </canvas>
                </div>
            </div>
        );
    }
}