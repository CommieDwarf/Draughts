"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var startGame_1 = __importDefault(require("./startGame"));
function gameMenu(props) {
    var centerClass = props.centered ? "game-menu--center" : "";
    return (react_1.default.createElement("div", { className: "game-menu no-select " + centerClass },
        react_1.default.createElement("div", null,
            react_1.default.createElement(startGame_1.default, { title: "Start Local Game", gameMode: 0 /* LOCAL */, startNewGame: props.startNewGame, label: "local" }),
            react_1.default.createElement(startGame_1.default, { title: "Start Vs Computer Game", gameMode: 1 /* BOT */, startNewGame: props.startNewGame, label: "vsComp" }))));
}
exports.default = gameMenu;
//# sourceMappingURL=gameMenu.js.map