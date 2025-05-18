import React from "react";
import ReactDOM from "react-dom";

import App from './App';


import io from "socket.io-client";
export const socket = io("https://draughts-jq3mkq.fly.dev/");



ReactDOM.render(<App />, document.querySelector(".container"));