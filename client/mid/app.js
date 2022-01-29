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
var gameMenu_1 = __importDefault(require("./components/gameMenu"));
var lobby_1 = __importDefault(require("./components/lobby/lobby"));
var gamePreview_1 = __importDefault(require("./components/gamePreview"));
var game_1 = __importDefault(require("./game"));
var inputName_1 = __importDefault(require("./components/inputName"));
var main_1 = require("./main");
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.setName = function (name) {
            _this.requestPlayerList();
            _this.setState({ name: name });
        };
        _this.startNewGame = function (gameMode, side, color) {
            if (_this.checkNameTaken(_this.state.name, _this.state.players)) {
                _this.setState({ newGameError: "Name is taken" });
                return false;
            }
            else if (_this.state.games.length < 4 && _this.state.name.length > 0) {
                if (_this.gameId == 0) {
                    _this.connect(_this.state.name);
                }
                _this.setState(function (state) {
                    var label = _this.getLabel(gameMode);
                    //////////////////////////---------------------------------------------------
                    var game = new game_1.default(gameMode, color, 2 /* CUSTOM */, label, _this.gameId++);
                    _this.menuPosition = "right";
                    return {
                        games: __spreadArray([game], state.games, true),
                        currentGame: game,
                        newGameError: "",
                    };
                });
                return true;
            }
            else if (_this.state.games.length == 4) {
                _this.setState({ newGameError: "Games max quantity reached. Close a game" });
                return false;
            }
            else {
                _this.setState({ newGameError: "Enter your name" });
                return false;
            }
        };
        _this.switchGame = function (id) {
            var game = _this.state.games.filter(function (game) { return game.id == id; })[0];
            if (game) {
                _this.setState({
                    currentGame: game
                });
            }
        };
        _this.state = {
            name: "",
            games: [],
            newGameError: "",
            currentGame: null,
            players: [],
            nameTaken: false,
        };
        _this.menuPosition = 'center';
        _this.gameId = 0;
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
    App.prototype.connect = function (name) {
        main_1.socket.emit("player-connected", name);
        console.log('player connected');
    };
    App.prototype.requestPlayerList = function () {
        main_1.socket.emit("request_players_list");
    };
    App.prototype.checkNameTaken = function (name, players) {
        var taken = players.filter(function (player) { return name == player.name; });
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
            console.log(players);
        });
    };
    App.prototype.render = function () {
        var games = this.state.games;
        if (this.state.currentGame) {
            return (react_1.default.createElement("div", { id: "app", className: "app" },
                react_1.default.createElement(gamePreview_1.default, { games: games, switchGame: this.switchGame }),
                react_1.default.createElement(lobby_1.default, { name: this.state.name }),
                react_1.default.createElement(gameMenu_1.default, { startNewGame: this.startNewGame, centered: false, error: this.state.newGameError }),
                react_1.default.createElement(board_1.default, { game: this.state.currentGame })));
        }
        else {
            return (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(inputName_1.default, { setName: this.setName }),
                react_1.default.createElement(gameMenu_1.default, { centered: true, startNewGame: this.startNewGame, error: this.state.newGameError })));
        }
    };
    return App;
}(react_1.default.Component));
exports.default = App;
//# sourceMappingURL=App.js.map