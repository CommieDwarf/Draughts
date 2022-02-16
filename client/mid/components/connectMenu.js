"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function ConnectMenu(props) {
    return react_1.default.createElement("div", { className: "connect-menu no-select", onClick: props.connect }, " Connect ");
}
exports.default = ConnectMenu;
//# sourceMappingURL=ConnectMenu.js.map