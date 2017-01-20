import './app.scss';
import PlayerCanvas from './PlayerCanvas.jsx';
import HostCanvas from './HostCanvas.jsx';

import React, { Component } from "react";
import ReactDOM from "react-dom";

class App extends Component {

    constructor(props){
        super(props);
    }

    render(){
        /* large device as hosts */
        /* mobile device as clients */
        const largeDev = window.innerWidth > 1000;
        return (
            <div className="app-container">
                 {largeDev ? <HostCanvas/> : <PlayerCanvas/>}
            </div>
        )
    }
}





ReactDOM.render(
    <App/>
    ,document.getElementById("app"));