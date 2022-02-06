"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function ColorSelection(props) {
    var side = props.color == "white" ? 0 /* NORMAL */ : 1 /* REVERSED */;
    function handleClick() {
        var isStarted = props.startNewGame(props.gameMode, side, props.color, props.label);
        if (isStarted) {
            props.setError("");
        }
        else {
            props.setError("Game quantity limit reached. Close some game");
        }
    }
    return (react_1.default.createElement("div", { className: "game-menu__color", onClick: handleClick }, props.color));
}
exports.default = ColorSelection;
//# sourceMappingURL=colorSelection.js.map