import React, { Component } from 'react';
import './playerCanvas.scss';
import io from 'socket.io-client';

const socket = io();

export default class PlayerCanvas extends Component {


  constructor(props) {
    super(props);
    this.state = {
      imgData: [],
      startPos: {},
      endPos: {},
      drawing: false,
    };

    this.updateCanvas = this.updateCanvas.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseUpHandler = this.mouseUpHandler.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
  }

  componentDidMount() {
    this.updateCanvas();
    /* adds a event listener to listen for any browser resizing */
    window.addEventListener('resize', this.updateCanvas, false);
    const ctx = this.refs.canvas.getContext('2d');
    ctx.strokeStyle = '#69D2E7';
    ctx.lineWidth = 5;
    ctx.canvas.addEventListener('touchstart', this.mouseDownHandler, false);
    ctx.canvas.addEventListener('touchend', this.mouseUpHandler, false);
    ctx.canvas.addEventListener('touchmove', this.mouseMoveHandler, false);
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
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight - 50;
  }

  render() {
    return (
      <div className="player-game-wrapper">
        <div className="player-message-container">Player Name however long they want</div>
        <div className="player-prompt-container"> Prompt Message for player instructions </div>
        <div className="player-canvas-wrapper">
          <canvas className="player-canvas" ref="canvas" />
        </div>
      </div>
    );
  }
}
