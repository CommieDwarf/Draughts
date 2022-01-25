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
var BotLabel = /** @class */ (function (_super) {
    __extends(BotLabel, _super);
    function BotLabel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BotLabel.prototype.render = function () {
        return (react_1.default.createElement("div", { id: "bot-label", className: "label" },
            react_1.default.createElement("div", { id: "AA", className: "bot-letter" }, "A"),
            react_1.default.createElement("div", { id: "BB", className: "bot-letter" }, "B"),
            react_1.default.createElement("div", { id: "CC", className: "bot-letter" }, "C"),
            react_1.default.createElement("div", { id: "DD", className: "bot-letter" }, "D"),
            react_1.default.createElement("div", { id: "EE", className: "bot-letter" }, "E"),
            react_1.default.createElement("div", { id: "FF", className: "bot-letter" }, "F"),
            react_1.default.createElement("div", { id: "GG", className: "bot-letter" }, "G"),
            react_1.default.createElement("div", { id: "HH", className: "bot-letter" }, "H")));
    };
    return BotLabel;
}(react_1.default.Component));
exports.default = BotLabel;
//# sourceMappingURL=bot-label.js.map