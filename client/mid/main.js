"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket = void 0;
var react_1 = __importDefault(require("react"));
var react_dom_1 = __importDefault(require("react-dom"));
var App_1 = __importDefault(require("./App"));
var socket_io_client_1 = __importDefault(require("socket.io-client"));
exports.socket = (0, socket_io_client_1.default)("http://localhost:3001");
react_dom_1.default.render(react_1.default.createElement(App_1.default, null), document.getElementById("container"));
//# sourceMappingURL=main.js.map