import React, { Component } from 'react';
import './playerCanvas.scss';

export default class PlayerCanvas extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pixels: [],
    };

    this.updateCanvas = this.updateCanvas.bind(this);
    this.mouseDownHandler = this.mouseDownHandler.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
  }

  componentDidMount() {
    this.updateCanvas();
    /* adds a event listener to listen for any browser resizing */
    window.addEventListener('resize', this.updateCanvas, false);
    const ctx = this.refs.canvas.getContext('2d');
    ctx.strokeStyle = '#69D2E7';
    ctx.canvas.addEventListener('touchstart', this.mouseDownHandler, false);
    ctx.canvas.addEventListener('mousedown', this.mouseDownHandler, false);

    ctx.canvas.addEventListener('touchend', this.mouseUpHandler, false);
    ctx.canvas.addEventListener('touchmove', this.mouseMoveHandler, false);
  }

  mouseDownHandler(e) {
    e.preventDefault();
    e.stopPropagation();
    const ctx = this.refs.canvas.getContext('2d');


    const xyCoords = this.getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(xyCoords.x, xyCoords.y);
    // pixels.push('moveStart');
    this.setState({ pixels: ['moveStart'] });
    this.setState({ pixels: Object.assign({}, this.state.pixels, ...xyCoords) });
    // pixels.push(xyCoords.x, xyCoords.y);
    console.log('xyCoords:', xyCoords);
  }

  mouseMoveHandler(e) {
    const ctx = this.refs.canvas.getContext('2d');
    const xy = this.getCoordinates(e);
    console.log('xyCoords mousemove:', xy);
    this.setState({ pixels: Object.assign({}, this.state.pixels, ...xy) });
    ctx.lineTo(xy.x, xy.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(xy.x, xy.y);
  }

  mouseUpHandler(e) {
  }

  getCoordinates(e) {
    let x;
    let y;
    const ctx = this.refs.canvas.getContext('2d');
    if (e.changedTouches && e.changedTouches[0]) {
      x = e.changedTouches[0].pageX - ctx.canvas.offsetLeft;
      y = e.changedTouches[0].pageY - ctx.canvas.offsetTop;
    }
    console.log(`XY COORDS: ${x} ::: ${y}`);
    return { x, y };
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
