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
var main_1 = require("../../main");
var Avatar_1 = __importDefault(require("../lobby/Avatar"));
var WinMenu = /** @class */ (function (_super) {
    __extends(WinMenu, _super);
    function WinMenu(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClick = function () {
            var props = _this.props;
            if (_this.props.game.gameMode == 2 /* ONLINE */ && !_this.props.rematch) {
                var rematch = {
                    gameId: props.game.id,
                    player: props.player,
                    requested: true,
                    roomId: props.game.roomId,
                };
                main_1.socket.emit("player_wants_rematch", rematch);
                _this.setState({ rematchSent: true });
            }
            else if (_this.props.rematch) {
                var id = props.game.id ? props.game.id : 0;
                _this.props.restart(id);
                main_1.socket.emit("restart_game", id);
            }
            else {
                _this.props.restart(0);
            }
        };
        _this.state = {
            rematchSent: false,
        };
        return _this;
    }
    WinMenu.prototype.componentDidMount = function () {
        var _this = this;
        main_1.socket.on("rematch_accepted", function (gameId) {
            _this.props.restart(gameId);
        });
    };
    WinMenu.prototype.componentWillUnmount = function () {
        main_1.socket.off();
    };
    WinMenu.prototype.render = function () {
        var winner = this.props.winner;
        var playAgainClass = this.state.rematchSent
            ? "win-menu__play-again--selected"
            : "";
        return (react_1.default.createElement("div", { className: "win-menu " },
            react_1.default.createElement("h1", null,
                winner,
                " Wins!"),
            react_1.default.createElement("h2", { className: "win-menu__play-again " + playAgainClass, onClick: this.handleClick }, "Play Again?"),
            this.props.rematch && (react_1.default.createElement("div", { className: "win-menu__avatar" },
                react_1.default.createElement(Avatar_1.default, { name: this.props.player.name, theme: this.props.player.avatar.theme, shape: this.props.player.avatar.shape }))),
            this.props.rematch && (react_1.default.createElement("h3", { className: "win-menu__rematch" },
                this.props.rematch.player && this.props.player.name + " ",
                "wants rematch!")),
            this.state.rematchSent && (react_1.default.createElement("div", { className: "win-menu__waiting-pawn-div" },
                react_1.default.createElement("img", { className: "lobby__avatar-placeholder win-menu__waiting-pawn", src: "./img/pawn.png" }))),
            this.state.rematchSent && (react_1.default.createElement("h3", { className: "win-menu__rematch" },
                "Waiting for ",
                this.props.player.name,
                " to accept"))));
    };
    return WinMenu;
}(react_1.default.Component));
exports.default = WinMenu;
//# sourceMappingURL=WinMenu.js.map