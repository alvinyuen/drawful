import React, { Component } from 'react';
import io from 'socket.io-client';

import './hostCanvas.scss';


export default class HostCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
    };
  }

  componentDidMount() {
    const socket = io();
    socket.emit('host-room');
    socket.on('host-room-response', (payload) => {
      this.setState({ roomCode: payload.roomCode });
    });
  }

  render() {
    const width = window.innerWidth - 15;
    const height = window.innerHeight - 15;
    return (
      <div className="host-wrapper">
        <div className="host-canvas-wrapper">
          <canvas
            className="host-canvas" ref="canvas" width={width} height={height}
            style={{ background: 'url("/img/host-bg.png")' }}
          />
          <div className="overlay">
            Join Game at localhost:8888
          </div>
          <div className="overlay2">
            There are X players in current game
          </div>
          <div className="overlay3">
            Room Code: {this.state.roomCode}
          </div>
          <img alt="img here" />

          <button className="btn btn-success start-game-button">
            START GAME
          </button>
        </div>
      </div>
    );
  }
}






