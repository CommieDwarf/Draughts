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
var ContextMenu = /** @class */ (function (_super) {
    __extends(ContextMenu, _super);
    function ContextMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.onClickTopHandler = function () {
            var props = _this.props;
            if (props.queen) {
                props.chessboard[props.id]["queen"] = false;
            }
            else if (props.piece) {
                props.chessboard[props.id]['queen'] = true;
            }
            else {
                props.chessboard[props.id]["piece"] = "black";
            }
        };
        _this.onClickBotHandler = function () {
            var props = _this.props;
            if (props.queen) {
                props.chessboard[props.id]["piece"] = "";
                props.chessboard[props.id]["queen"] = false;
            }
            else if (props.piece) {
                props.chessboard[props.id]['piece'] = "";
            }
            else {
                props.chessboard[props.id]["piece"] = "white";
            }
        };
        _this.props = props;
        _this.state = {};
        return _this;
    }
    ContextMenu.prototype.render = function () {
        var props = this.props;
        var label1;
        var label2;
        if (props.queen) {
            label1 = "queen";
            label2 = "remove";
        }
        else if (props.piece) {
            label1 = "queen";
            label2 = "remove";
        }
        else {
            label1 = "black";
            label2 = "white";
        }
        return (react_1.default.createElement("div", { className: "contextMenu", id: "contextMenu" },
            react_1.default.createElement("div", { className: "contextTop", onClick: this.onClickTopHandler }, label1),
            react_1.default.createElement("hr", null),
            react_1.default.createElement("div", { className: "contextBot", onClick: this.onClickBotHandler }, label2),
            react_1.default.createElement("br", null)));
    };
    return ContextMenu;
}(react_1.default.Component));
exports.default = ContextMenu;
//# sourceMappingURL=context-menu.js.map