"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
;
function GameInvitation(props) {
    function handleClick() {
        props.acceptChallange(props.author, props.gameId, props.roomId);
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "lobby__game-invitation-text" },
            props.author,
            " is challenging you"),
        react_1.default.createElement("div", { className: "lobby__acceptButton", onClick: handleClick }, "Accept")));
}
exports.default = GameInvitation;
//# sourceMappingURL=GameInvitation.js.map