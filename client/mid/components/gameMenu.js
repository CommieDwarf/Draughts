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
var colorSelection_1 = __importDefault(require("./colorSelection"));
var GameMenu = /** @class */ (function (_super) {
    __extends(GameMenu, _super);
    function GameMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.startGame = function (event) {
            var gameMode = 0 /* LOCAL */;
            var side = 0 /* NORMAL */;
            var target = event.target;
            if (target) {
                gameMode;
                if (target.closest("#local")) {
                    gameMode = 0 /* LOCAL */;
                }
                else if (target.closest(".choose-color")) {
                    gameMode = 1 /* BOT */;
                    if (target.closest("#choose-white")) {
                        side = 0 /* NORMAL */;
                    }
                    else {
                        side = 1 /* REVERSED */;
                    }
                }
                else {
                    gameMode = 2 /* ONLINE */;
                }
            }
            var isStarted = _this.props.startNewGame(gameMode, side, "white");
            if (isStarted) {
                _this.hideAndUnselectAll();
            }
        };
        _this.toggleShowGames = function () {
            if (_this.state.gameTypeVisibility == "game-menu__game-type--hidden") {
                _this.setState({ gameTypeVisibility: 'game-menu__game-type--visible' });
            }
            else {
                _this.setState({ gameTypeVisibility: "game-menu__game-type--hidden" });
                _this.hideAndUnselectAll();
            }
            _this.toggleSelectNewGame();
        };
        _this.toggleShowColor = function () {
            if (_this.state.colorVisibility == "game-menu__color--hidden") {
                _this.setState({ colorVisibility: 'game-menu__color--visible' });
            }
            else {
                _this.setState({ colorVisibility: "game-menu__color--hidden" });
            }
            _this.toggleSelectGame();
        };
        _this.toggleSelectNewGame = function () {
            if (_this.state.newGameSelect == "") {
                _this.setState({ newGameSelect: "game-menu__game-type--selected" });
            }
            else {
                _this.setState({ newGameSelect: "" });
            }
        };
        _this.toggleSelectGame = function () {
            if (_this.state.gameSelect == "") {
                _this.setState({ gameSelect: "selected-menu" });
            }
            else {
                _this.setState({ gameSelect: "" });
            }
        };
        _this.handleClickOutside = function (event) {
            if (_this.menuRef.current && !_this.menuRef.current.contains(event.target)) {
                _this.hideAndUnselectAll();
            }
        };
        _this.componentDidMount = function () {
            document.addEventListener('mousedown', _this.handleClickOutside);
        };
        _this.componentWillUnmount = function () {
            document.removeEventListener('mousedown', _this.handleClickOutside);
        };
        _this.props = props;
        _this.state = {
            gameTypeVisibility: "game-menu__game-type--hidden",
            colorVisibility: "game-menu__color--hidden",
            newGameSelect: "",
            gameSelect: ""
        };
        _this.menuRef = react_1.default.createRef();
        return _this;
    }
    GameMenu.prototype.hideAndUnselectAll = function () {
        this.setState({
            gameTypeVisibility: "game-menu__game-type--hidden",
            colorVisibility: "game-menu__color--hidden",
            newGameSelect: "",
            gameSelect: ""
        });
    };
    GameMenu.prototype.render = function () {
        var menuClass = this.props.centered ? "game-menu--center" : "game-menu--float-right";
        var gameTypeVisibility = this.state.gameTypeVisibility;
        var colorVisibility = this.state.colorVisibility;
        return (react_1.default.createElement("div", { className: "game-menu no-select " + menuClass, ref: this.menuRef },
            react_1.default.createElement("div", { onClick: this.toggleShowGames, className: "game-menu__new-game " + this.state.newGameSelect },
                react_1.default.createElement("h3", null, "Start new game")),
            react_1.default.createElement("div", { className: "game-menu__games" },
                react_1.default.createElement("div", { className: "game-menu__game-type " + gameTypeVisibility, id: "local", onClick: this.startGame }, "Local"),
                react_1.default.createElement("div", { className: "game-menu__game-type " + "game-menu__game-type--vsComp " + gameTypeVisibility + " " + this.state.gameSelect, onClick: this.toggleShowColor }, "Versus computer")),
            react_1.default.createElement(colorSelection_1.default, { startNewGame: this.props.startNewGame, visibility: colorVisibility }),
            react_1.default.createElement("p", { className: "game-menu__error" }, this.props.error)));
    };
    return GameMenu;
}(react_1.default.Component));
exports.default = GameMenu;
//# sourceMappingURL=gameMenu.js.map