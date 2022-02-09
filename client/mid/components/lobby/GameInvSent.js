"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function GameInvitation(props) {
    return react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "lobby__game-invitation-text" },
            "You challanged ",
            props.target));
}
exports.default = GameInvitation;
//# sourceMappingURL=GameInvSent.js.map