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
            if (props.contextMenu.queen) {
                props.chessboard[props.contextMenu.i]["queen"] = false;
            }
            else if (props.contextMenu.piece) {
                props.chessboard[props.contextMenu.i]['queen'] = true;
            }
            else {
                props.chessboard[props.contextMenu.i]["piece"] = "black";
            }
            document.dispatchEvent(new Event("chessboardChanged"));
        };
        _this.onClickBotHandler = function () {
            var props = _this.props;
            if (props.contextMenu.queen) {
                props.chessboard[props.contextMenu.i]["piece"] = "";
                props.chessboard[props.contextMenu.i]["queen"] = false;
            }
            else if (props.contextMenu.piece) {
                props.chessboard[props.contextMenu.i]['piece'] = "";
            }
            else {
                props.chessboard[props.contextMenu.i]["piece"] = "white";
            }
            document.dispatchEvent(new Event("chessboardChanged"));
        };
        _this.handleOutsideClick = function (event) {
            var target = event.target;
            if (target && _this.ctxMenuRef.current && !target.contains(_this.ctxMenuRef.current)) {
                _this.props.hide();
            }
        };
        _this.props = props;
        _this.state = {};
        _this.ctxMenuRef = react_1.default.createRef();
        return _this;
    }
    ContextMenu.prototype.setCordAttributes = function () {
        var contextMenu = this.ctxMenuRef.current;
        if (contextMenu) {
            var attribute = "left: " + this.props.contextMenu.clientX + "px; ";
            attribute += "top: " + this.props.contextMenu.clientY + "px; ";
            contextMenu.setAttribute("style", attribute);
        }
    };
    ContextMenu.prototype.componentDidMount = function () {
        this.setCordAttributes();
        var container = document.querySelector(".container");
        if (container) {
            container.addEventListener("click", this.handleOutsideClick);
        }
    };
    ContextMenu.prototype.componentDidUpdate = function () {
        this.setCordAttributes();
        var container = document.querySelector(".container");
        if (container) {
            container.removeEventListener("click", this.handleOutsideClick);
        }
    };
    ContextMenu.prototype.render = function () {
        var props = this.props;
        var label1;
        var label2;
        if (props.contextMenu.queen) {
            label1 = "queen";
            label2 = "remove";
        }
        else if (props.contextMenu.piece) {
            label1 = "queen";
            label2 = "remove";
        }
        else {
            label1 = "black";
            label2 = "white";
        }
        return (react_1.default.createElement("div", { className: "context-menu", ref: this.ctxMenuRef },
            react_1.default.createElement("div", { className: "context-menu__label", onClick: this.onClickTopHandler }, label1),
            react_1.default.createElement("hr", { className: "context-menu__break-line" }),
            react_1.default.createElement("div", { className: "context-menu__label", onClick: this.onClickBotHandler }, label2),
            react_1.default.createElement("br", null)));
    };
    return ContextMenu;
}(react_1.default.Component));
exports.default = ContextMenu;
//# sourceMappingURL=context-menu.js.map