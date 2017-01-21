import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, hashHistory } from 'react-router';

import './app.scss';
import PlayerCanvas from './PlayerCanvas.jsx';
import HostCanvas from './HostCanvas.jsx';
import PlayerJoin from './PlayerJoin.jsx';

const htmlWindow = window;

const App = () => {
  /* large device as hosts */
  /* mobile device as clients */

  const largeDev = htmlWindow.innerWidth > 1000;
  if (largeDev) {
    browserHistory.push('/host');
  } else {
    browserHistory.push('/playerJoin');
  }


  return (
    <Router history={browserHistory}>
      <Route path="/">
        <Route path="host" component={HostCanvas} />
        <Route path="playerJoin" component={PlayerJoin} />
        <Route path="player" component={PlayerCanvas} />
      </Route>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
