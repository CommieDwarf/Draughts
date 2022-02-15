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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var top_label_1 = __importDefault(require(".//labels/top-label"));
var left_label_1 = __importDefault(require("./labels/left-label"));
var chessboard_1 = __importDefault(require("./board/chessboard"));
var right_label_1 = __importDefault(require("./labels/right-label"));
var bot_label_1 = __importDefault(require("./labels/bot-label"));
var main_1 = require("../main");
var Board = /** @class */ (function (_super) {
    __extends(Board, _super);
    function Board(props) {
        var _this = _super.call(this, props) || this;
        _this.setWinner = function (winner) {
            _this.setState({
                winner: winner,
            });
        };
        _this.clickHandler = function (event) {
            //this.setState({contextMenu: {...this.state.contextMenu, showMenu: false}});
            _this.props.game.clickHandler(event);
            if (_this.props.game.gameMode == 2 /* ONLINE */ && _this.props.game.roomId) {
                var gameInfo = {
                    chessboard: _this.props.game.engine.chessboard,
                    id: _this.props.game.id,
                    turn: _this.props.game.engine.turn,
                    winner: _this.props.game.engine.winner,
                    roomId: _this.props.game.roomId,
                };
                main_1.socket.emit("make_move", gameInfo);
            }
        };
        _this.hideContextMenu = function () {
            _this.setState(function (prevState) {
                return {
                    contextMenu: __assign(__assign({}, prevState.contextMenu), { showMenu: false }),
                };
            });
        };
        _this.onContextHandler = function (event) {
            event.preventDefault();
            var engine = _this.props.game.engine;
            var square = event.target.closest(".chessboard__square");
            if (square &&
                square.className !== "chessboard__square chessboard__square--white") {
                var id = square.getAttribute("id");
                var queen = engine.chessboard[id]["queen"];
                var piece = engine.chessboard[id]["piece"];
                var clientRect = square.getBoundingClientRect();
                var clientX = clientRect.left;
                var clientY = clientRect.top;
                var width = square.offsetWidth;
                var height = square.offsetHeight;
                clientX += width / 2;
                clientY += height / 2 + 10;
                _this.setState({
                    contextMenu: {
                        piece: piece,
                        queen: queen,
                        i: id,
                        clientX: clientX,
                        clientY: clientY,
                        showMenu: true,
                    },
                });
            }
            return false;
        };
        _this.props = props;
        _this.state = {
            contextMenu: {
                piece: "",
                queen: false,
                i: 0,
                clientX: 0,
                clientY: 0,
                showMenu: false,
            },
            winner: "",
        };
        _this.contextMenuRef = react_1.default.createRef();
        _this.interval = null;
        return _this;
    }
    Board.prototype.render = function () {
        var _this = this;
        if (restartFlag) {
            restartFlag = false;
        }
        var engine = this.props.game.engine;
        var rematch = this.props.rematches.find(function (r) { return r.gameId == _this.props.game.id; });
        return (react_1.default.createElement("div", { className: "board", onClick: this.clickHandler, onContextMenu: this.onContextHandler },
            react_1.default.createElement(top_label_1.default, null),
            react_1.default.createElement(left_label_1.default, null),
            react_1.default.createElement(right_label_1.default, null),
            react_1.default.createElement(chessboard_1.default, { engine: engine, preview: false, game: this.props.game, setWinner: this.setWinner, restartGame: this.props.restartGame, player: this.props.player, rematch: rematch }),
            react_1.default.createElement(bot_label_1.default, null)));
    };
    return Board;
}(react_1.default.Component));
exports.default = Board;
var restartFlag = false;
//# sourceMappingURL=board.js.map