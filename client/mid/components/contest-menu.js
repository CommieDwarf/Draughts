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
var ContestMenu = /** @class */ (function (_super) {
    __extends(ContestMenu, _super);
    function ContestMenu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContestMenu.prototype.render = function () {
        return (react_1.default.createElement("div", { className: "contestMenu" }, "ggfdgdfgdfgdfgffgdfdgdfgfdgdf"));
    };
    return ContestMenu;
}(react_1.default.Component));
exports.default = ContestMenu;
//# sourceMappingURL=contest-menu.js.map