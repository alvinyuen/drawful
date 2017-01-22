import React, { Component } from 'react';
import io from 'socket.io-client';

import './gameRound.scss';

const hexColors = ['#1abc9c', '#f39c12', '#f1c40f', '#16a085', '#2ecc71', '#d35400', '#e67e22', '#27ae60', '#3498db', '#c0392b', '#2980b9', '#e74c3c', '#2c3e50', '#7f8c8d', '#9b59b6', '#34495e', '#3E4651', '3b5999', 'cd201f', '02b875', '007ee5', '3aaf85'];

export const socket = io();

export default class GameRound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timer: 20,
    };
  }

  componentDidMount() {
      // set timer for player inputs
    const timerInt = setInterval(() => {
      this.setState({ timer: this.state.timer - 1 });
      if (this.state.timer === 0) {
        clearInterval(timerInt);
        console.log('START GUESSES::', this.props.roomCode);
        socket.emit('start-guesses', this.props.roomCode);
      }
    }, 1000);
  }


  render() {
    return (
      <div>
        <div className="game-overlay">
          What is it?
        </div>
        {this.state.timer ?
          <div className="game-overlay2">
            {this.state.timer}
          </div> : null }
      </div>
    );
  }
}
