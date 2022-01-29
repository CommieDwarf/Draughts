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
var context_menu_1 = __importDefault(require("./board/context-menu"));
var winMenu_1 = __importDefault(require("./board/winMenu"));
var Board = /** @class */ (function (_super) {
    __extends(Board, _super);
    function Board(props) {
        var _this = _super.call(this, props) || this;
        _this.setWinner = function (winner) {
            _this.setState({
                winner: winner
            });
        };
        _this.clickHandler = function (event) {
            var _a;
            _this.setState({ contextMenu: __assign(__assign({}, _this.state.contextMenu), { showMenu: false }) });
            _this.props.game.clickHandler(event);
            _this.forceUpdate();
            (_a = document.getElementById('games-preview')) === null || _a === void 0 ? void 0 : _a.dispatchEvent(new Event("click", { "bubbles": true }));
        };
        _this.onContextHandler = function (event) {
            event.preventDefault();
            var engine = _this.props.game.engine;
            var square = event.target.closest(".square");
            var id;
            var queen;
            var piece;
            var clientX;
            var clientY;
            if (square && square.className !== "square white") {
                id = square.getAttribute("id");
                queen = engine.chessboard[id]["queen"];
                piece = engine.chessboard[id]["piece"];
                var clientRect = square.getBoundingClientRect();
                clientX = clientRect.left;
                clientY = clientRect.top;
                var width = square.offsetWidth;
                var height = square.offsetHeight;
                clientX += width / 2;
                clientY += height / 2 + 10;
                _this.setState({ contextMenu: {
                        piece: piece,
                        queen: queen,
                        i: id,
                        clientX: clientX,
                        clientY: clientY,
                        showMenu: true,
                    } });
            }
            return false;
        };
        _this.onForceUpdateHandler = function () {
            _this.forceUpdate();
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
        _this.restartGame = _this.restartGame.bind(_this);
        return _this;
    }
    Board.prototype.componentDidUpdate = function () {
        var engine = this.props.game.engine;
        // context menu managment
        // win menu managment
        var winMenu = document.getElementById('winMenu');
        if (winMenu) {
            if (engine.winner) {
                winMenu.setAttribute("style", "visibility: visible");
            }
            else {
                winMenu.setAttribute("style", "visibility: hidden");
            }
        }
    };
    Board.prototype.restartGame = function () {
    };
    Board.prototype.render = function () {
        if (restartFlag) {
            restartFlag = false;
        }
        var engine = this.props.game.engine;
        var ctxMenu = this.state.contextMenu;
        return (react_1.default.createElement("div", { className: "board", onClick: this.clickHandler, onContextMenu: this.onContextHandler },
            react_1.default.createElement(winMenu_1.default, { winner: engine.winner, restart: this.restartGame }),
            react_1.default.createElement(top_label_1.default, null),
            react_1.default.createElement(left_label_1.default, null),
            react_1.default.createElement(right_label_1.default, null),
            react_1.default.createElement(chessboard_1.default, { engine: engine, preview: false, id: 0, game: this.props.game, setWinner: this.setWinner }),
            react_1.default.createElement(bot_label_1.default, null),
            react_1.default.createElement(context_menu_1.default, { contextMenu: this.state.contextMenu, chessboard: engine.chessboard })));
    };
    return Board;
}(react_1.default.Component));
exports.default = Board;
var restartFlag = false;
//# sourceMappingURL=board.js.map