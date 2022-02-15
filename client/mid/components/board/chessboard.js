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
var CloseGame_1 = __importDefault(require("./CloseGame"));
var winMenu_1 = __importDefault(require("./winMenu"));
var Chessboard = /** @class */ (function (_super) {
    __extends(Chessboard, _super);
    function Chessboard(props) {
        var _this = _super.call(this, props) || this;
        _this.forceUpdateHandler = function () {
            _this.forceUpdate();
            if (_this.props.engine.winner && _this.props.setWinner) {
                _this.props.setWinner(_this.props.engine.winner);
            }
        };
        _this.handleClick = function () {
            if (_this.props.switchGame) {
                _this.props.switchGame(_this.props.game.id);
            }
        };
        _this.props = props;
        _this.chessboardRef = react_1.default.createRef();
        _this.timeout = null;
        return _this;
    }
    Chessboard.prototype.getPieceType = function (id) {
        var engine = this.props.engine;
        if (engine.selectedPiece == id) {
            return "selected";
        }
        else if (engine.lockedPieces.includes(id)) {
            return "locked";
        }
        else if (engine.killablePieces.includes(id)) {
            return "killable";
        }
        else {
            return "normal";
        }
    };
    Chessboard.prototype.getBgAnimationClass = function () {
        if (this.props.engine.turn == this.props.game.playerColor) {
            return "bg-animation--green";
        }
        else {
            return "bg-animation--white";
        }
    };
    Chessboard.prototype.componentDidMount = function () {
        document.addEventListener("chessboardChanged", this.forceUpdateHandler);
    };
    Chessboard.prototype.componentWillUnmount = function () {
        document.removeEventListener("chessboardChanged", this.forceUpdateHandler);
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
                    var id = (row - 1) * 8 + column - 1;
                    if (engine.availableMoves.includes(id)) {
                        className += " chessboard__square--hightlight";
                    }
                    pieceColor = engine.chessboard[id]["piece"];
                    var queen = engine.chessboard[id]["queen"];
                    squares.push(react_1.default.createElement(square_1.default, { id: id.toString(), className: className, key: id, pieceColor: pieceColor, type: this.getPieceType(id), queen: queen }));
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
        var closeIcon = "";
        var label = "";
        var currentGameClass = "";
        if (this.props.current) {
            currentGameClass = "game-preview__chessboard-wrapper--current";
        }
        if (this.props.preview) {
            previewWrapperClass = "game-preview__chessboard-wrapper";
            previewChessboardClass = "game-preview__chessboard";
            closeIcon = (react_1.default.createElement(CloseGame_1.default, { gameId: game.id, closeGame: this.props.closeGame, game: this.props.game }));
            var playerLabelClass = "";
            if (this.props.game.gameMode == 2 /* ONLINE */) {
                playerLabelClass = "game-label__label--green";
            }
            label = (react_1.default.createElement("div", { className: "game-preview__label " + playerLabelClass }, this.props.label));
        }
        var bgAnimationClass = this.getBgAnimationClass();
        return (react_1.default.createElement("div", { className: previewWrapperClass + " " + currentGameClass, onClick: this.handleClick },
            label,
            react_1.default.createElement("div", { className: "chessboard bg-animation " +
                    bgAnimationClass +
                    " " +
                    previewChessboardClass, ref: this.chessboardRef },
                this.props.game.engine.winner &&
                    this.props.restartGame &&
                    this.props.player && (react_1.default.createElement(winMenu_1.default, { winner: engine.winner, restart: this.props.restartGame, game: this.props.game, player: this.props.player, rematch: this.props.rematch })),
                squares),
            closeIcon));
    };
    return Chessboard;
}(react_1.default.Component));
exports.default = Chessboard;
//# sourceMappingURL=chessboard.js.map