"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var letters_1 = __importDefault(require("./letters"));
;
function Label(props) {
    var isSideTopOrBot = ["top", "bot"].includes(props.side);
    return (react_1.default.createElement("div", { className: "board__" + props.side + "-label no-select" }, letters_1.default.map(function (letter, index) {
        return (react_1.default.createElement("div", { className: "board__" + props.side + "-label-" + (isSideTopOrBot ? "letter" : "num"), key: index }, isSideTopOrBot ? letter : index + 1));
    })));
}
exports.default = Label;
//# sourceMappingURL=Label.js.map