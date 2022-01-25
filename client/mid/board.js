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
var top_label_1 = __importDefault(require("./components/labels/top-label"));
var left_label_1 = __importDefault(require("./components/labels/left-label"));
var chessboard_1 = __importDefault(require("./components/board/chessboard"));
var right_label_1 = __importDefault(require("./components/labels/right-label"));
var bot_label_1 = __importDefault(require("./components/labels/bot-label"));
var context_menu_1 = __importDefault(require("./components/board/context-menu"));
var bGroundAnimation_1 = require("./bGroundAnimation");
var winMenu_1 = __importDefault(require("./components/board/winMenu"));
var game_1 = __importDefault(require("./game"));
// const enum GAMEMODE {
//     LOCAL,
//     BOT,
//     ONLINE
// }
var Board = /** @class */ (function (_super) {
    __extends(Board, _super);
    function Board(props) {
        var _this = _super.call(this, props) || this;
        _this.clickHandler = function (event) {
            _this.setState({ contextMenu: __assign(__assign({}, _this.state.contextMenu), { showMenu: false }) });
            _this.forceUpdate();
        };
        _this.onContextHandler = function (event) {
            event.preventDefault();
            var engine = _this.state.game.engine;
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
        _this.state = {
            contextMenu: {
                piece: "",
                queen: false,
                i: 0,
                clientX: 0,
                clientY: 0,
                showMenu: false,
            },
            game: new game_1.default(1 /* BOT */, "white"),
        };
        _this.interval = null;
        _this.state.game.startNewGame();
        _this.restartGame = _this.restartGame.bind(_this);
        return _this;
    }
    Board.prototype.componentDidUpdate = function () {
        var engine = this.state.game.engine;
        // context menu managment
        var contextMenu = document.getElementById('contextMenu');
        if (contextMenu) {
            var attribute = "left: " + this.state.contextMenu.clientX + "px; ";
            attribute += "top: " + this.state.contextMenu.clientY + "px; ";
            if (this.state.contextMenu.showMenu) {
                attribute += "visibility: visible";
            }
            else {
                attribute += "visibility: hidden";
            }
            contextMenu.setAttribute("style", attribute);
        }
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
        this.setState({ game: new game_1.default(0 /* LOCAL */, "white") });
        restartFlag = true;
    };
    Board.prototype.render = function () {
        if (restartFlag) {
            var chessboard = this.state.game.startNewGame();
            this.state.game.makeChessboardInteractive(chessboard);
            restartFlag = false;
        }
        var engine = this.state.game.engine;
        var ctxMenu = this.state.contextMenu;
        return (react_1.default.createElement("div", { id: "game", onClick: this.clickHandler, onContextMenu: this.onContextHandler },
            react_1.default.createElement(winMenu_1.default, { winner: engine.winner, restart: this.restartGame }),
            react_1.default.createElement(top_label_1.default, null),
            react_1.default.createElement(left_label_1.default, null),
            react_1.default.createElement(chessboard_1.default, { engine: engine, preview: false }),
            react_1.default.createElement(right_label_1.default, null),
            react_1.default.createElement(bot_label_1.default, null),
            react_1.default.createElement(context_menu_1.default, { piece: ctxMenu.piece, queen: ctxMenu.queen, id: ctxMenu.i, chessboard: engine.chessboard })));
    };
    Board.prototype.componentDidMount = function () {
        var _this = this;
        this.state.game.makeChessboardInteractive(this.state.game.engine.chessboard);
        this.interval = setInterval(function () {
            _this.forceUpdate();
        }, 100);
    };
    Board.prototype.componentWillUnmount = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    };
    return Board;
}(react_1.default.Component));
exports.default = Board;
var restartFlag = false;
(0, bGroundAnimation_1.animateFog)(30);
//# sourceMappingURL=board.js.map