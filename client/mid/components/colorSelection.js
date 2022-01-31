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
var ColorSelection = /** @class */ (function (_super) {
    __extends(ColorSelection, _super);
    function ColorSelection(props) {
        var _this = _super.call(this, props) || this;
        _this.onClickHandler = function (event) {
            var target = event.target;
            var color;
            var side;
            if (target.closest(".game-menu__color--white")) {
                color = "white";
                side = 0 /* NORMAL */;
            }
            else {
                color = "black";
                side = 1 /* REVERSED */;
            }
            _this.props.startNewGame(1 /* BOT */, side, color);
        };
        _this.props = props;
        return _this;
    }
    ColorSelection.prototype.render = function () {
        var visibility = this.props.visibility;
        return (react_1.default.createElement("div", { className: "game-menu__color-selection" },
            react_1.default.createElement("div", { className: "game-menu__color " + visibility + " game-menu__color--white", onClick: this.onClickHandler }, "Play white"),
            react_1.default.createElement("div", { className: "game-menu__color " + visibility + " game-menu__color--black", onClick: this.onClickHandler }, "Play black")));
    };
    return ColorSelection;
}(react_1.default.Component));
exports.default = ColorSelection;
//# sourceMappingURL=colorSelection.js.map