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
        _this.chessboardRef = react_1.default.createRef();
        _this.timeout = null;
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
    Chessboard.prototype.componentDidMount = function () {
    };
    Chessboard.prototype.getBgAnimationClass = function () {
        if (this.props.engine.turn == this.props.game.playerColor && this.chessboardRef.current) {
            return "bg-animation--green";
        }
        else {
            return "bg-animation--white";
        }
    };
    Chessboard.prototype.render = function () {
        var engine = this.props.engine;
        var game = this.props.game;
        var squares = [];
        if (engine.chessboard.length > 0) {
            var className = "chessboard__square chessboard__square--black";
            var pieceColor = void 0;
            for (var row = 1; row <= 8; row++) {
                for (var column = 1; column <= 8; column++) {
                    if (className == "chessboard__square chessboard__square--white") {
                        className = "chessboard__square chessboard__square--black";
                    }
                    else {
                        className = "chessboard__square chessboard__square--white";
                    }
                    var id_1 = (row - 1) * 8 + column - 1;
                    if (engine.availableMoves.includes(id_1)) {
                        className += " chessboard__square--hightlight";
                    }
                    pieceColor = engine.chessboard[id_1]['piece'];
                    var queen = engine.chessboard[id_1]["queen"];
                    squares.push(react_1.default.createElement(square_1.default, { id: id_1.toString(), className: className, key: id_1, pieceColor: pieceColor, type: this.getPieceType(id_1), queen: queen }));
                }
                if (className == "chessboard__square chessboard__square--white") {
                    className = "chessboard__square chessboard__square--black";
                }
                else {
                    className = "chessboard__square chessboard__square--white";
                }
            }
        }
        var previewWrapperClass = "";
        var previewChessboardClass = "";
        var id = this.props.id ? this.props.id : 0;
        var closeIcon = "";
        var label = "";
        if (this.props.preview) {
            previewWrapperClass = "game-preview__chessboard-wrapper";
            previewChessboardClass = "game-preview__chessboard";
            closeIcon = (react_1.default.createElement("div", { id: "close-game-" + id, className: "game-preview__close-game" },
                react_1.default.createElement("i", { className: "icon-cancel-circled" })));
            label = (react_1.default.createElement("div", { id: "game-label-preview-" + id, className: "game-preview__label" }, this.props.label));
        }
        var bgAnimationClass = this.getBgAnimationClass();
        return (react_1.default.createElement("div", { className: previewWrapperClass },
            label,
            react_1.default.createElement("div", { className: "chessboard bg-animation " + bgAnimationClass + " " + previewChessboardClass, id: ("chessboard-" + id), ref: this.chessboardRef }, squares),
            closeIcon));
    };
    return Chessboard;
}(react_1.default.Component));
exports.default = Chessboard;
//# sourceMappingURL=chessboard.js.map