import React, { Component } from 'react';
import io from 'socket.io-client';

import GameRound from './GameRound.jsx';
import './hostCanvas.scss';

export const socket = io();

const hexColors = ['#1abc9c', '#f39c12', '#f1c40f', '#16a085', '#2ecc71', '#d35400', '#e67e22', '#27ae60', '#3498db', '#c0392b', '#2980b9', '#e74c3c', '#2c3e50', '#7f8c8d', '#9b59b6', '#34495e', '#3E4651', '3b5999', 'cd201f', '02b875', '007ee5', '3aaf85'];

export default class HostCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      mainMenu: true,
      timerMenu: false,
      dipMenu: false,
      timer: 0,
      roundMenu: false,
      round: {},
    };
    this.startGame = this.startGame.bind(this);
  }

  componentDidMount() {
    console.log('host mount');

    /* socket */
    socket.emit('host-room');
    socket.on('host-room-response', (payload) => {
      this.setState({ roomCode: payload.roomCode });
    });

    socket.on('save-avatar-response', (payload) => {
      console.log('RECEIVE PLAYER NAME', payload.playerName);
      const ctx = this.refs.canvas.getContext('2d');
      const avatarImg = new Image();
      avatarImg.src = payload.avatar.avatar;
      avatarImg.onload = () => {
        console.log('ONLOAD');
        ctx.font = '30px Open Sans';
        // load avatar position based on player number
        switch (payload.playerNum) {
          case 1:
            ctx.drawImage(avatarImg, 100, 100, 200, 200);
            ctx.fillStyle = hexColors[payload.playerNum];
            ctx.fillText(payload.playerName.toUpperCase(), 100, 100);
            break;
          case 2:
            ctx.drawImage(avatarImg, 100, 200, 200, 200);
            ctx.fillStyle = hexColors[payload.playerNum];
            ctx.fillText(payload.playerName.toUpperCase(), 100, 200);
            break;
          case 3:
            ctx.drawImage(avatarImg, 100, 300, 200, 200);
            ctx.fillStyle = hexColors[payload.playerNum];
            ctx.fillText(payload.playerName.toUpperCase(), 100, 300);
            break;
          case 4:
            ctx.drawImage(avatarImg, 100, 400, 200, 200);
            ctx.fillStyle = hexColors[payload.playerNum];
            ctx.fillText(payload.playerName.toUpperCase(), 100, 400);
            break;
          case 5:
            ctx.drawImage(avatarImg, 100, 500, 200, 200);
            ctx.fillStyle = hexColors[payload.playerNum];
            ctx.fillText(payload.playerName.toUpperCase(), 100, 500);
            break;
          default:
            break;
        }
      };
    });

    socket.on('round-start', (round) => {
      console.log('initiating rounds:', round);
      this.setState({ dipMenu: false });
      this.setState({ timerMenu: false });
      this.setState({ roundMenu: true });
      const ctx = this.refs.canvas.getContext('2d');
      // clear canvas first
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const roundImg = new Image();
      roundImg.src = round.drawing;
      roundImg.onload = () => {
        ctx.drawImage(roundImg, 100, 100, 600, 600);
        ctx.fillStyle = hexColors[1];
      };
    });

    // keywords sent, start timer
    socket.on('keywords-sent', () => {
      console.log('STARTING TIMER ON HOST');
      this.setState({ mainMenu: false });
      this.setState({ dipMenu: true });
      this.setState({ timerMenu: true });
      this.setState({ timer: 20 });
      const timerInt = setInterval(() => { this.setState({ timer: this.state.timer - 1 }); }, 1000);

      setTimeout(() => {
        clearInterval(timerInt);
        this.setState({ dipMenu: false });
        this.setState({ timerMenu: false });
        socket.emit('start-rounds');
      }, 20000);
    });
  }

  startGame() {
    socket.emit('start-game', { roomCode: this.state.roomCode });
  }


  render() {
    const width = window.innerWidth - 15;
    const height = window.innerHeight - 15;
    return (
      <div className="host-wrapper">
        <div className="host-canvas-wrapper">
          <canvas
            className="host-canvas" ref="canvas" width={width} height={height}
          />
          {this.state.mainMenu ?
            <div>
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

              <button onClick={this.startGame} className="btn btn-success start-game-button">
                START GAME
              </button>
            </div> : null }

          {this.state.dipMenu ?
            <div>
              <div className="overlay"> Time to Draw ! </div>
              {this.state.timerMenu ?
                <div className="overlay2"> {this.state.timer} </div> : null }
            </div>
            : null}

          {this.state.roundMenu ?
            <GameRound round={this.state.round} /> : null }

        </div>
      </div>
    );
  }
}


    //  style={{ background: 'url("/img/host-bg.png")' }}





