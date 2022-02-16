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
var getPieceJSX_1 = require("./getPieceJSX");
var Piece = /** @class */ (function (_super) {
    __extends(Piece, _super);
    function Piece(props) {
        return _super.call(this, props) || this;
    }
    Piece.prototype.render = function () {
        var piece = (0, getPieceJSX_1.getPieceJSX)(this.props.color, this.props.type, this.props.queen);
        return piece;
    };
    return Piece;
}(react_1.default.Component));
exports.default = Piece;
//# sourceMappingURL=Piece.js.map