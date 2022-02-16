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
var Piece_1 = __importDefault(require("./Piece"));
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(props) {
        return _super.call(this, props) || this;
    }
    Square.prototype.render = function () {
        return (react_1.default.createElement("div", { id: this.props.id, className: this.props.className },
            react_1.default.createElement(Piece_1.default, { color: this.props.pieceColor, id: this.props.id, type: this.props.type, queen: this.props.queen })));
    };
    return Square;
}(react_1.default.Component));
exports.default = Square;
//# sourceMappingURL=Square.js.map