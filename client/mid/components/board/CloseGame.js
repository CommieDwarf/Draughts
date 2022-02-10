"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var main_1 = require("../../main");
function CloseGame(props) {
    function handleClick() {
        if (props.closeGame) {
            props.closeGame(props.gameId);
            if (props.game.gameMode == 2 /* ONLINE */) {
                main_1.socket.emit("player-close-game", { gameId: props.game.id, roomId: props.game.roomId });
            }
        }
    }
    return (react_1.default.createElement("div", { className: "game-preview__close-game", onClick: handleClick },
        react_1.default.createElement("i", { className: "icon-cancel-circled" })));
}
exports.default = CloseGame;
//# sourceMappingURL=CloseGame.js.map