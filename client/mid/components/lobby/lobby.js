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
var chat_1 = __importDefault(require("./chat"));
var main_1 = require("../../main");
var players_1 = __importDefault(require("./players"));
var Lobby = /** @class */ (function (_super) {
    __extends(Lobby, _super);
    function Lobby(props) {
        var _this = _super.call(this, props) || this;
        _this.createRoom = function (name) {
            if (!_this.state.rooms.includes(name) && name !== _this.props.name) {
                _this.setState(function (prevState) {
                    return {
                        rooms: __spreadArray(__spreadArray([], prevState.rooms, true), [name], false),
                        currentRoom: name,
                        canInvite: false,
                    };
                });
            }
            var roomName = _this.props.name + name;
        };
        _this.handlePlayerInvite = function (event) {
            var target = event.target;
            var player = target.closest(".player");
            if (_this.state.canInvite && player) {
                _this.createRoom(player.id);
                console.log(target.id);
            }
        };
        _this.handleClickNewRoom = function () {
            _this.setState({ canInvite: true });
        };
        _this.handleOutsidePlayersClick = function (event) {
            var _a, _b;
            var target = event.target;
            if (!((_a = _this.playersRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) && !((_b = _this.createRoomRef.current) === null || _b === void 0 ? void 0 : _b.contains(target))) {
                _this.setState({ canInvite: false });
            }
        };
        _this.componentDidMount = function () {
            main_1.socket.on("players_update", function (players) {
                _this.setState({ players: players });
            });
            document.addEventListener('click', _this.handleOutsidePlayersClick);
        };
        _this.props = props;
        _this.state = {
            players: [],
            rooms: ["global room"],
            currentRoom: "global room",
            canInvite: false,
        };
        _this.playersRef = react_1.default.createRef();
        _this.createRoomRef = react_1.default.createRef();
        return _this;
    }
    Lobby.prototype.componentWillUnmount = function () {
        document.removeEventListener('click', this.handleOutsidePlayersClick);
        main_1.socket.off("players_update");
    };
    Lobby.prototype.render = function () {
        var _this = this;
        var player = this.state.players.find(function (player) { return player.name == _this.props.name; });
        var rooms = this.state.rooms.map(function (room, id) {
            var roomClass = "";
            if (room == _this.state.currentRoom) {
                roomClass = "lobby__room--current";
            }
            return react_1.default.createElement("div", { className: "lobby__room no-select " + roomClass, id: room, key: id }, room);
        });
        var newRoomButtonClass = "";
        if (this.state.canInvite) {
            newRoomButtonClass = "lobby__new-room-button--green";
        }
        return (react_1.default.createElement("div", { className: "lobby" },
            react_1.default.createElement("div", { className: "lobby__invite-button" }, "Invite"),
            react_1.default.createElement("div", { className: "lobby__players", ref: this.playersRef },
                react_1.default.createElement(players_1.default, { players: this.state.players, invitable: this.state.canInvite, handlePlayerInvite: this.handlePlayerInvite }),
                ";"),
            react_1.default.createElement("div", { className: "lobby__rooms" },
                rooms,
                react_1.default.createElement("div", { className: "lobby__new-room-button no-select " + newRoomButtonClass, onClick: this.handleClickNewRoom, ref: this.createRoomRef },
                    react_1.default.createElement("i", { className: "icon-user-plus" }))),
            player && react_1.default.createElement(chat_1.default, { player: player, currentRoom: this.state.currentRoom })));
    };
    return Lobby;
}(react_1.default.Component));
exports.default = Lobby;
//# sourceMappingURL=lobby.js.map