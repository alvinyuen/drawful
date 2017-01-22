import React, { Component } from 'react';
import { socket } from './HostCanvas.jsx';

import './playerGuess.scss';



export default class PlayerGuess extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerName: '',
      keyword: '',
      message: '',
      guessMenu: false,
      guessOptions: [],
    };
    this.submitKeyword = this.submitKeyword.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  componentDidMount() {
    console.log('PLAYER GUESS COMPONENT MOUNTED');

    socket.on('guess-list', (keywordList) => {
      console.log('PLAYER RECEIVING GAME ROUND INFO', keywordList);
      this.setState({ guessMenu: true });
      this.setState({ guessOptions: keywordList });
    });
  }

  handleInput(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  submitKeyword() {
    console.log('submit keyword');
    if (!this.state.keyword.length) {
      this.setState({ message: 'Can\'t be empty!' });
    } else {
      this.setState({ message: 'Nice!' });
      socket.emit('submit-keyword', (this.state.keyword));
      this.setState({ keyword: '' });
    }
  }

  render() {
    return (
      <div >
        {this.state.guessMenu ?
          <div className="player-guess-option-wrapper">
            <div className="player-guess-join-title">{this.state.message}</div>
            <section className="player-guess-container">
              {this.state.guessOptions.map((keyword, i) =>
                <button
                  key={i}
                  className="player-guess-select-button"
                  onClick={this.submitKeyword}
                  onTouchStartCapture={this.submitKeyword}
                > {keyword}
                </button>,
              )}
            </section>
          </div>
           :
          <div className="player-guess-wrapper">
            <div className="player-guess-join-title">{this.state.message}</div>
            <section className="player-guess-container">
              <div className="player-guess-input-container">
                <input
                  className="player-guess-input"
                  value={this.state.keyword}
                  placeholder="Enter your keyword"
                  name="keyword"
                  onChange={this.handleInput}
                />
              </div>

              <button
                className="player-guess-submit-button"
                onClick={this.submitKeyword}
                onTouchStart={this.submitKeyword}
              > Submit
              </button>
            </section>
          </div> }
      </div>
    );
  }
}
