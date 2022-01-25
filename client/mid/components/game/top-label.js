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
var TopLabel = /** @class */ (function (_super) {
    __extends(TopLabel, _super);
    function TopLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TopLabel.prototype.render = function () {
        return (react_1.default.createElement("div", { id: "top-label", className: "label" },
            react_1.default.createElement("div", { id: "A", className: "top-letter" }, "A"),
            react_1.default.createElement("div", { id: "B", className: "top-letter" }, "B"),
            react_1.default.createElement("div", { id: "C", className: "top-letter" }, "C"),
            react_1.default.createElement("div", { id: "D", className: "top-letter" }, "D"),
            react_1.default.createElement("div", { id: "E", className: "top-letter" }, "E"),
            react_1.default.createElement("div", { id: "F", className: "top-letter" }, "F"),
            react_1.default.createElement("div", { id: "G", className: "top-letter" }, "G"),
            react_1.default.createElement("div", { id: "H", className: "top-letter" }, "H")));
    };
    return TopLabel;
}(react_1.default.Component));
exports.default = TopLabel;
//# sourceMappingURL=top-label.js.map