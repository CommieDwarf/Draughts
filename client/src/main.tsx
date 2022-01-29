import React from "react";
import ReactDOM from "react-dom";

import App from './App';


import io from "socket.io-client";
export const socket = io("http://localhost:3001");



ReactDOM.render(<App />, document.querySelector(".container"));