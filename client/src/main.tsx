import React from "react";
import ReactDOM from "react-dom";

import App from './app';


import io from "socket.io-client";
export const socket = io("https://draughts.herokuapp.com/");



ReactDOM.render(<App />, document.querySelector(".container"));