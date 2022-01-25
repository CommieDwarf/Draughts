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
var square_1 = __importDefault(require("./square"));
var Chessboard = /** @class */ (function (_super) {
    __extends(Chessboard, _super);
    function Chessboard(props) {
        var _this = _super.call(this, props) || this;
        _this.props = props;
        return _this;
    }
    Chessboard.prototype.getPieceType = function (id) {
        var engine = this.props.engine;
        if (engine.selectedPiece == id) {
            return 'selected';
        }
        else if (engine.lockedPieces.includes(id)) {
            return "locked";
        }
        else if (engine.killablePieces.includes(id)) {
            return "killable";
        }
        else {
            return 'normal';
        }
    };
    Chessboard.prototype.render = function () {
        var engine = this.props.engine;
        var squares = [];
        if (engine.chessboard.length > 0) {
            var className = "square";
            var pieceColor = void 0;
            for (var row = 1; row <= 8; row++) {
                for (var column = 1; column <= 8; column++) {
                    className = className == "square white" ? "square" : "square white";
                    var id = (row - 1) * 8 + column - 1;
                    if (engine.availableMoves.includes(id)) {
                        className += " highlightedSquare";
                    }
                    pieceColor = engine.chessboard[id]['piece'];
                    var queen = engine.chessboard[id]["queen"];
                    var pieceType = this.getPieceType(id);
                    squares.push(react_1.default.createElement(square_1.default, { id: id.toString(), className: className, key: id, pieceColor: pieceColor, type: this.getPieceType(id), queen: queen }));
                }
                className = className == "square white" ? "square" : "square white";
            }
        }
        else {
        }
        return (react_1.default.createElement("div", { className: "chessboard" }, squares));
    };
    return Chessboard;
}(react_1.default.Component));
exports.default = Chessboard;
//# sourceMappingURL=chessboard.js.map