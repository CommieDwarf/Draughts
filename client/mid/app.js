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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var Board_1 = __importDefault(require("./components/Board"));
var GameMenu_1 = __importDefault(require("./components/gameMenu/GameMenu"));
var Lobby_1 = __importDefault(require("./components/lobby/Lobby"));
var GamePreview_1 = __importDefault(require("./components/GamePreview"));
var game_1 = __importDefault(require("./game"));
var InputName_1 = __importDefault(require("./components/InputName"));
var ConnectMenu_1 = __importDefault(require("./components/ConnectMenu"));
var reverseChessboard_1 = __importDefault(require("./reverseChessboard"));
var main_1 = require("./main");
;
;
;
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.setName = function (name) {
            main_1.socket.emit("request_players_list");
            _this.setState({ name: name });
        };
        _this.connect = function () {
            if (_this.state.name.length == 0) {
                _this.setState({ nameError: "Enter your name" });
            }
            else if (_this.checkNameTaken()) {
                _this.setState({ nameError: "This name is taken" });
            }
            else {
                main_1.socket.emit("player-connected", _this.state.name);
                _this.setState({ connected: true });
            }
        };
        _this.startNewGame = function (gameMode, side, color, label, gameId, roomId) {
            if (roomId === void 0) { roomId = ""; }
            var game = new game_1.default(gameMode, color, side, label, gameId, roomId);
            _this.setState(function (prevState) {
                return {
                    currentGame: game,
                    games: __spreadArray(__spreadArray([], prevState.games, true), [game], false),
                };
            });
            return true;
        };
        _this.switchGame = function (id) {
            var game = _this.state.games.find(function (game) { return game.id == id; });
            if (game) {
                _this.setState({
                    currentGame: game,
                });
            }
        };
        _this.closeGame = function (gameId) {
            var game = _this.state.games.find(function (g) { return g.id == gameId; });
            if (game == _this.state.currentGame) {
                _this.setState(function (state) {
                    return {
                        games: state.games.filter(function (g) { return g.id != gameId; }),
                        currentGame: null,
                    };
                });
            }
            else {
                _this.setState(function (state) {
                    return {
                        games: state.games.filter(function (g) { return g.id != gameId; }),
                    };
                });
            }
        };
        _this.restartGame = function (gameId) {
            if (gameId === void 0) { gameId = 0; }
            var game;
            if (gameId) {
                game = _this.state.games.find(function (g) { return g.id == gameId; });
            }
            else {
                game = _this.state.currentGame;
            }
            if (game) {
                var index = _this.state.games.findIndex(function (g) {
                    return g.id == game.id;
                });
                var games = _this.state.games;
                var newGame = new game_1.default(game.gameMode, game.playerColor, game.side, game.label, gameId, game.roomId);
                games[index] = newGame;
                _this.setState({ games: games, currentGame: newGame });
            }
        };
        _this.state = {
            name: "",
            games: [],
            newGameError: "",
            currentGame: null,
            players: [],
            connected: false,
            nameError: "",
            rematches: [],
        };
        _this.menuPosition = "center";
        _this.gameCounter = 0;
        _this.justStarted = true;
        return _this;
    }
    App.prototype.getLabel = function (mode) {
        switch (mode) {
            case 1 /* BOT */:
                return "vsComp";
            case 0 /* LOCAL */:
                return "local";
            case 2 /* ONLINE */:
                return "player";
        }
    };
    App.prototype.checkNameTaken = function () {
        var _this = this;
        var taken = this.state.players.filter(function (player) { return _this.state.name == player.name; });
        if (taken.length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    App.prototype.getPlayer = function (name) {
        var player = this.state.players.find(function (player) { return player.name == name; });
        if (!player) {
            player = this.state.players[0];
        }
        return player;
    };
    App.prototype.componentDidMount = function () {
        var _this = this;
        main_1.socket.on("get_players", function (players) {
            _this.setState({ players: players });
        });
        main_1.socket.on("player_disconnected", function (player) {
            var game = _this.state.games.find(function (g) { return g.label == player.name; });
            if (game) {
                _this.closeGame(game.id);
            }
        });
        main_1.socket.on("move_made", function (_a) {
            var chessboard = _a.chessboard, id = _a.id, turn = _a.turn, winner = _a.winner, gameRoomId = _a.gameRoomId;
            _this.setState(function (prevState) {
                var _a;
                var gameIndex = prevState.games.findIndex(function (g) { return g.id == id; });
                var gamesBefore = prevState.games.slice(0, gameIndex);
                var gamesAfter = prevState.games.slice(gameIndex + 1, prevState.games.length);
                var game = prevState.games[gameIndex];
                game.engine.chessboard = (0, reverseChessboard_1.default)(chessboard);
                game.engine.turn = turn;
                game.engine.winner = winner;
                game.engine.playerSide = "bot";
                var currentGame = prevState.currentGame;
                if (((_a = prevState.currentGame) === null || _a === void 0 ? void 0 : _a.id) == id) {
                    currentGame == game;
                }
                return {
                    games: __spreadArray(__spreadArray(__spreadArray([], gamesBefore, true), [game], false), gamesAfter, true),
                    currentGame: currentGame,
                };
            });
        });
        main_1.socket.on("player_wants_rematch", function (rematch) {
            _this.setState(function (prevState) {
                return {
                    rematches: __spreadArray(__spreadArray([], prevState.rematches, true), [rematch], false),
                };
            });
        });
        main_1.socket.on("game_restarted", function (id) {
            _this.restartGame(id);
        });
        main_1.socket.on("player_closed_game", function (info) {
            _this.closeGame(info.gameId);
        });
    };
    App.prototype.componentWillUnmount = function () {
        main_1.socket.off();
    };
    App.prototype.render = function () {
        var player = this.getPlayer(this.state.name);
        var games = this.state.games;
        var gameMenuCentered = this.state.currentGame ? false : true;
        if (this.state.connected) {
            return (react_1.default.createElement("div", { id: "app", className: "app" },
                react_1.default.createElement(GamePreview_1.default, { games: games, switchGame: this.switchGame, closeGame: this.closeGame, currentGame: this.state.currentGame }),
                react_1.default.createElement(Lobby_1.default, { name: this.state.name, startNewGame: this.startNewGame }),
                this.state.currentGame && (react_1.default.createElement(Board_1.default, { game: this.state.currentGame, restartGame: this.restartGame, player: player, rematches: this.state.rematches })),
                react_1.default.createElement(GameMenu_1.default, { startNewGame: this.startNewGame, centered: gameMenuCentered, error: this.state.newGameError, games: this.state.games })));
        }
        else {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(InputName_1.default, { setName: this.setName, error: this.state.nameError }),
                react_1.default.createElement(ConnectMenu_1.default, { connect: this.connect })));
        }
    };
    return App;
}(react_1.default.Component));
exports.default = App;
//# sourceMappingURL=App.js.map