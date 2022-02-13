import React from "react";
import ReactDOM from "react-dom";

import App from './App';


import io from "socket.io-client";
export const socket = io("https://murmuring-oasis-45557.herokuapp.com/");



ReactDOM.render(<App />, document.querySelector(".container"));