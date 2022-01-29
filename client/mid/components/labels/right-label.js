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
var RightLabel = /** @class */ (function (_super) {
    __extends(RightLabel, _super);
    function RightLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RightLabel.prototype.render = function () {
        return (react_1.default.createElement("div", { className: "board__right-label" },
            react_1.default.createElement("div", { className: "board__right-label-num" }, "1"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "2"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "3"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "4"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "5"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "6"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "7"),
            react_1.default.createElement("div", { className: "board__right-label-num" }, "8")));
    };
    return RightLabel;
}(react_1.default.Component));
exports.default = RightLabel;
//# sourceMappingURL=right-label.js.map