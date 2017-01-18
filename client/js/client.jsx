import './client.scss';

import React, { Component } from "react";
import ReactDOM from "react-dom";


class App extends Component {

    render(){
        return(
            <div className="app-container">Drawful App </div>
        )
    }

}

ReactDOM.render(
    <App/>
    ,document.getElementById("app"));