import React, { Component } from 'react';
import './playerCanvas.scss';
import { socket } from './HostCanvas.jsx';
import PlayerGuess from './PlayerGuess.jsx';

const hexColors = ['#1abc9c', '#f39c12', '#f1c40f', '#16a085', '#2ecc71', '#d35400', '#e67e22', '#27ae60', '#3498db', '#c0392b', '#2980b9', '#e74c3c', '#2c3e50', '#7f8c8d', '#9b59b6', '#34495e', '#3E4651', '3b5999', 'cd201f', '02b875', '007ee5', '3aaf85'];

export default class PlayerCanvas extends Component {


  constructor(props) {
    super(props);
    this.state = {
      imgData: {},
      startPos: {},
      endPos: {},
      drawing: false,
      canvasWidth: window.innerWidth,
      canvasHeight: window.innerWidth,
      name: ' ',
      message: '',
      avatarMenu: true,
      keywordMenu: false,
    };

    this.updateCanvas = this.updateCanvas.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.submitAvatar = this.submitAvatar.bind(this);
    this.submitDrawing = this.submitDrawing.bind(this);
  }

  componentDidMount() {
    this.updateCanvas();
    /* adds a event listener to listen for any browser resizing */
    window.addEventListener('resize', this.updateCanvas, false);
    const ctx = this.refs.canvas.getContext('2d');
    ctx.strokeStyle = hexColors[this.props.routeParams.playerNum];
    ctx.lineWidth = 7;
    ctx.canvas.addEventListener('touchstart', this.mouseDownHandler, false);
    ctx.canvas.addEventListener('touchend', this.mouseUpHandler, false);
    ctx.canvas.addEventListener('touchmove', this.mouseMoveHandler, false);

    /* sockets */
    socket.on('send-keyword', ({ keyword }) => {
      console.log('KEYWORD IS:', keyword);
      this.setState({ message: keyword });
    });

    socket.on('round-enter-keyword', (round) => {
      console.log('PLAYER ENTER KEYWORD START', round);
      this.setState({ avatarMenu: false });
      this.setState({ keywordMenu: true });
    });
  }

  getCoordinates(e) {
    let x;
    let y;
    const ctx = this.refs.canvas.getContext('2d');
    if (e.changedTouches && e.changedTouches[0]) {
      x = e.changedTouches[0].pageX - ctx.canvas.offsetLeft;
      y = e.changedTouches[0].pageY - ctx.canvas.offsetTop;
    }
    return { x, y };
  }

  draw() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(this.state.startPos.x, this.state.startPos.y);
    ctx.lineTo(this.state.endPos.x, this.state.endPos.y);
    ctx.stroke();
  }

  mouseDownHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const ctx = this.refs.canvas.getContext('2d');
    this.setState({ drawing: true });
    const xy = this.getCoordinates(e);
    this.setState({ startPos: xy });
  }

  mouseMoveHandler(e) {
    if (!this.state.drawing) return;
    const ctx = this.refs.canvas.getContext('2d');
    const xy = this.getCoordinates(e);
    console.log('xyCoords start:', this.state.startPos.x, this.state.startPos.y);
    console.log('xyCoords end:', xy);
    this.setState({ endPos: xy });
    this.draw();
    this.setState({ startPos: xy });
  }

  mouseUpHandler() {
    this.setState({ drawing: false });
  }

  updateCanvas() {
    console.log('UPDATE CANVAS');
    const ctx = this.refs.canvas.getContext('2d');
    ctx.canvas.width = this.state.canvasWidth;
    ctx.canvas.height = this.state.canvasHeight;
  }

  submitAvatar() {
    const ctx = this.refs.canvas.getContext('2d');
    const avatar = this.refs.canvas.toDataURL();
    socket.emit('save-avatar', { avatar });
    this.setState({ avatarMenu: false });
    ctx.clearRect(0, 0, this.state.canvasWidth, this.state.canvasHeight);
  }

  submitDrawing() {
    const drawing = this.refs.canvas.toDataURL();
    socket.emit('submit-drawing', { drawing });
  }

  render() {
    return (
      <div className="player-game-wrapper">
        {this.state.keywordMenu ?
          <PlayerGuess /> :
          <div>
            <div className="player-message-container">{this.state.name}</div>
            <div className="player-prompt-container"> {this.state.message} </div>
            <div className="player-canvas-wrapper">
              <canvas className="player-canvas" ref="canvas" />
            </div>
            {this.state.avatarMenu ?
              <button
                className="player-canvas-button"
                onTouchStart={this.submitAvatar}
              > Submit Avatar </button> :
              <button
                className="player-canvas-button"
                onTouchStart={this.submitDrawing}
                onClick={this.submitDrawing}
              > Submit Drawing </button>}
          </div> }
      </div>
    );
  }
}
