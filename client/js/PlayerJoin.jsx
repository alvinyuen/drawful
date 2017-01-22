import React, { Component } from 'react';
import { socket } from './HostCanvas.jsx';
import { browserHistory } from 'react-router';


import './playerJoin.scss';



export default class playerJoin extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      playerName: '',
    };
    this.joinRoom = this.joinRoom.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  joinRoom() {
    socket.emit('player-join', { roomCode: this.state.roomCode, playerName: this.state.playerName });
    socket.on('player-join-response', (payload) => {
      /* direct to players in-game canvas page */
      if (payload.playerNum) {
        browserHistory.push(`/player/${payload.playerNum}`);
      }
    });
  }

  render() {
    return (
      <div className="player-join-wrapper">
        <div className="player-join-title">Stackadraw</div>

        <section className="player-join-container">
          <div className="player-input-container">
            <input
              className="player-input" placeholder="Enter Room Number" name="roomCode"
              onChange={this.handleInput}
            />
          </div>

          <div className="player-input-container">
            <input
              className="player-input" placeholder="Enter your name" name="playerName"
              onChange={this.handleInput}
            />
          </div>

          <button
            className="player-join-button"
            onClick={this.joinRoom}
            onTouchStart={this.joinRoom}
          > JOIN
          </button>
        </section>
      </div>
    );
  }
}
