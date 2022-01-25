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
var WinMenu = /** @class */ (function (_super) {
    __extends(WinMenu, _super);
    function WinMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = function () {
            _this.props.restart();
        };
        _this.props = props;
        return _this;
    }
    WinMenu.prototype.render = function () {
        var winner = this.props.winner;
        var visibility = "win-menu--hidden";
        if (winner) {
            winner = winner[0].toUpperCase() + winner.slice(1);
            visibility = "win-menu--visible";
        }
        return (react_1.default.createElement("div", { className: "win-menu " + visibility },
            react_1.default.createElement("h1", null,
                winner,
                " Wins!"),
            react_1.default.createElement("h2", { className: "win-menu__play-again", onClick: this.handleClick }, "Play Again?")));
    };
    return WinMenu;
}(react_1.default.Component));
exports.default = WinMenu;
//# sourceMappingURL=winMenu.js.map