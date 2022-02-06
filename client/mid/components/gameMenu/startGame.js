"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var colorSelection_1 = __importDefault(require("./colorSelection"));
function StartGame(props) {
    var _a = (0, react_1.useState)(""), error = _a[0], setError = _a[1];
    (0, react_1.useEffect)(function () {
        if (props.games.length < 4) {
            setError("");
        }
    }, [props.games]);
    return (react_1.default.createElement("div", { className: "game-menu__start-game" },
        react_1.default.createElement("h3", null, props.title),
        react_1.default.createElement(colorSelection_1.default, { color: "white", gameMode: props.gameMode, startNewGame: props.startNewGame, label: props.label, setError: setError }),
        react_1.default.createElement(colorSelection_1.default, { color: "black", gameMode: props.gameMode, startNewGame: props.startNewGame, label: props.label, setError: setError }),
        react_1.default.createElement("p", { className: "game-menu__error" }, error)));
}
exports.default = StartGame;
//# sourceMappingURL=startGame.js.map