"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var leftLabel = /** @class */ (function (_super) {
    __extends(leftLabel, _super);
    function leftLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    leftLabel.prototype.render = function () {
        return (react_1.default.createElement("div", { id: "left-label", className: "label" },
            react_1.default.createElement("div", { id: "111", className: "left-num" }, "1"),
            react_1.default.createElement("div", { id: "222", className: "left-num" }, "2"),
            react_1.default.createElement("div", { id: "333", className: "left-num" }, "3"),
            react_1.default.createElement("div", { id: "444", className: "left-num" }, "4"),
            react_1.default.createElement("div", { id: "555", className: "left-num" }, "5"),
            react_1.default.createElement("div", { id: "666", className: "left-num" }, "6"),
            react_1.default.createElement("div", { id: "777", className: "left-num" }, "7"),
            react_1.default.createElement("div", { id: "888", className: "left-num" }, "8")));
    };
    return leftLabel;
}(react_1.default.Component));
exports.default = leftLabel;
//# sourceMappingURL=left-label.js.map