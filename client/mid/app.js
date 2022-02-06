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
var board_1 = __importDefault(require("./components/board"));
var gameMenu_1 = __importDefault(require("./components/gameMenu/gameMenu"));
var lobby_1 = __importDefault(require("./components/lobby/lobby"));
var gamePreview_1 = __importDefault(require("./components/gamePreview"));
var game_1 = __importDefault(require("./game"));
var inputName_1 = __importDefault(require("./components/inputName"));
var connectMenu_1 = __importDefault(require("./components/connectMenu"));
var main_1 = require("./main");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.setName = function (name) {
            _this.requestPlayerList();
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
        _this.startNewGame = function (gameMode, side, color, label) {
            if (_this.state.games.length == 4) {
                _this.setState({ newGameError: "Game quantity reached. Close some game" });
                return false;
            }
            else {
                var game_2 = new game_1.default(gameMode, color, side, label, _this.gameCounter++);
                _this.setState(function (prevState) {
                    return {
                        currentGame: game_2,
                        games: __spreadArray(__spreadArray([], prevState.games, true), [game_2], false)
                    };
                });
                return true;
            }
        };
        _this.switchGame = function (count) {
            var game = _this.state.games.filter(function (game) { return game.gameCounter == count; })[0];
            if (game) {
                _this.setState({
                    currentGame: game
                });
            }
        };
        _this.closeGame = function (gameCounter) {
            console.log(gameCounter);
            _this.setState(function (state) {
                return {
                    games: state.games.filter(function (game) { return game.gameCounter != gameCounter; }),
                    currentGame: null,
                };
            });
        };
        _this.restartGame = function () {
            var game = _this.state.currentGame;
            if (game) {
                var index = _this.state.games.findIndex(function (g) {
                    return g.gameCounter == game.gameCounter;
                });
                var games = _this.state.games;
                var newGame = new game_1.default(game.gameMode, game.playerColor, game.side, game.label, game.gameCounter);
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
        };
        _this.menuPosition = 'center';
        _this.gameCounter = 0;
        _this.justStarted = true;
        return _this;
    }
    App.prototype.getLabel = function (mode) {
        switch (mode) {
            case 1 /* BOT */:
                return 'vsComp';
            case 0 /* LOCAL */:
                return "local";
            case 2 /* ONLINE */:
                return "player";
        }
    };
    App.prototype.requestPlayerList = function () {
        main_1.socket.emit("request_players_list");
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
    App.prototype.componentDidMount = function () {
        var _this = this;
        main_1.socket.on("get_players", function (players) {
            _this.setState({ players: players });
        });
    };
    App.prototype.render = function () {
        var games = this.state.games;
        var gameMenuCentered = this.state.currentGame ? false : true;
        if (this.state.connected) {
            return (react_1.default.createElement("div", { id: "app", className: "app" },
                react_1.default.createElement(gamePreview_1.default, { games: games, switchGame: this.switchGame, closeGame: this.closeGame }),
                react_1.default.createElement(lobby_1.default, { name: this.state.name, startNewGame: this.startNewGame }),
                react_1.default.createElement(gameMenu_1.default, { startNewGame: this.startNewGame, centered: gameMenuCentered, error: this.state.newGameError, games: this.state.games }),
                this.state.currentGame && react_1.default.createElement(board_1.default, { game: this.state.currentGame, restartGame: this.restartGame })));
        }
        else {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(inputName_1.default, { setName: this.setName, error: this.state.nameError }),
                react_1.default.createElement(connectMenu_1.default, { connect: this.connect })));
        }
    };
    return App;
}(react_1.default.Component));
exports.default = App;
//# sourceMappingURL=App.js.map