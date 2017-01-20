import React from 'react';
import ReactDOM from 'react-dom';

import './app.scss';
import PlayerCanvas from './PlayerCanvas.jsx';
import HostCanvas from './HostCanvas.jsx';
import PlayerJoin from './PlayerJoin.jsx';

const htmlWindow = window;

const App = () => {
  /* large device as hosts */
  /* mobile device as clients */
  const largeDev = htmlWindow.innerWidth > 1000;
  return (
    <div className="app-container">
      {largeDev ? <HostCanvas /> : <PlayerJoin />}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));
