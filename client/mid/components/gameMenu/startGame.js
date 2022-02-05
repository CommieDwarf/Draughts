"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var colorSelection_1 = __importDefault(require("./colorSelection"));
function StartGame(props) {
    return (react_1.default.createElement("div", { className: "game-menu__start-game" },
        react_1.default.createElement("h3", null, props.title),
        react_1.default.createElement(colorSelection_1.default, { color: "white", gameMode: props.gameMode, startNewGame: props.startNewGame, label: props.label }),
        react_1.default.createElement(colorSelection_1.default, { color: "black", gameMode: props.gameMode, startNewGame: props.startNewGame, label: props.label }),
        react_1.default.createElement("p", { className: "game-menu__error" })));
}
exports.default = StartGame;
//# sourceMappingURL=startGame.js.map