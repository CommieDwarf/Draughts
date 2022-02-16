"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var StartGame_1 = __importDefault(require("./StartGame"));
function gameMenu(props) {
    var centerClass = props.centered ? "game-menu--center" : "";
    return (react_1.default.createElement("div", { className: "game-menu no-select " + centerClass },
        react_1.default.createElement("div", null,
            react_1.default.createElement(StartGame_1.default, { title: "Start Local Game", gameMode: 0 /* LOCAL */, startNewGame: props.startNewGame, label: "local", games: props.games }),
            react_1.default.createElement(StartGame_1.default, { title: "Start Vs Computer Game", gameMode: 1 /* BOT */, startNewGame: props.startNewGame, label: "vsComp", games: props.games }))));
}
exports.default = gameMenu;
//# sourceMappingURL=GameMenu.js.map