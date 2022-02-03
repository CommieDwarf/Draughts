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
            var roomId = _this.getRoomId(name);
            if (!_this.state.rooms.some(function (room) { return room.name == name; }) && name !== _this.props.name) {
                var room = { author: _this.props.name, target: name, id: roomId };
                main_1.socket.emit("join_room", room);
                main_1.socket.emit("create_room", room);
                _this.setState(function (prevState) {
                    return {
                        rooms: __spreadArray(__spreadArray([], prevState.rooms, true), [{ name: name, id: roomId, unread: false, hover: false }], false),
                        currentRoom: { name: name, id: roomId },
                        roomInvitable: false,
                    };
                });
            }
        };
        _this.closeRoom = function (name) {
            _this.setState(function (prevState) {
                return {
                    rooms: prevState.rooms.filter(function (room) { return room.name != name; })
                };
            });
        };
        _this.handleClickCloseRoom = function (event) {
            var target = event.target;
            var wrapper = target.closest('.lobby__room-wraper');
            var roomDiv = target.previousSibling;
            var roomName = roomDiv === null || roomDiv === void 0 ? void 0 : roomDiv.nodeValue;
            if (roomName) {
                _this.closeRoom(roomName);
            }
            console.log(roomDiv);
        };
        _this.handlePlayerInvite = function (event) {
            var target = event.target;
            var player = target.closest(".lobby__player");
            if (player && !_this.state.rooms.some(function (room) { room.name == player.id; }) && _this.state.roomInvitable) {
                _this.createRoom(player.id);
            }
        };
        _this.handleClickNewRoom = function () {
            _this.setState({ roomInvitable: true });
        };
        _this.handleOutsidePlayersClick = function (event) {
            var _a, _b;
            var target = event.target;
            if (!((_a = _this.playersRef.current) === null || _a === void 0 ? void 0 : _a.contains(target)) && !((_b = _this.createRoomRef.current) === null || _b === void 0 ? void 0 : _b.contains(target))) {
                _this.setState({ roomInvitable: false });
            }
        };
        _this.handleSwitchRoom = function (event) {
            var target = event.target;
            var room = target.closest(".lobby__room");
            var id = room === null || room === void 0 ? void 0 : room.id;
            var name = room === null || room === void 0 ? void 0 : room.textContent;
            if (name && id && id !== "global") {
                _this.setState({ currentRoom: { name: name, id: _this.getRoomId(name) } });
            }
            else {
                _this.setState({ currentRoom: { name: "global room", id: "global" } });
            }
            if (id) {
                _this.setRoomProperty(id, "unread", false);
            }
        };
        _this.setRoomProperty = function (id, propertyName, propertyValue) {
            var rooms = _this.state.rooms.filter(function (room) { return room.id == id; });
            var room = rooms[0];
            if (room instanceof Object && room) {
                Object.defineProperty(room, propertyName, { value: propertyValue });
                var index_1 = _this.state.rooms.findIndex(function (room) { return room.id == id; });
                _this.setState(function (prevState) {
                    return {
                        rooms: __spreadArray(__spreadArray(__spreadArray([], prevState.rooms.slice(0, index_1), true), [room], false), prevState.rooms.slice(index_1 + 1, prevState.rooms.length), true)
                    };
                });
            }
        };
        _this.handleMouseOverRoom = function (event) {
            _this.roomMouseMove(event, true);
        };
        _this.handleMouseLeaveRoom = function (event) {
            _this.roomMouseMove(event, false);
        };
        _this.componentDidMount = function () {
            main_1.socket.on("players_update", function (players) {
                _this.setState({ players: players });
            });
            main_1.socket.on("room_created", function (room) {
                if (_this.props.name == room.target) {
                    main_1.socket.emit("join_room", room);
                }
            });
            document.addEventListener('click', _this.handleOutsidePlayersClick);
        };
        _this.props = props;
        _this.state = {
            players: [],
            rooms: [{ name: "global room", id: "global", unread: false, hover: false }],
            currentRoom: { name: "global room", id: "global" },
            roomInvitable: false,
        };
        _this.playersRef = react_1.default.createRef();
        _this.createRoomRef = react_1.default.createRef();
        return _this;
    }
    Lobby.prototype.getRoomId = function (name) {
        var roomIdPart1;
        var roomIdPart2;
        if (name > this.props.name) {
            roomIdPart1 = name;
            roomIdPart2 = this.props.name;
        }
        else {
            roomIdPart1 = this.props.name;
            roomIdPart2 = name;
        }
        return roomIdPart1 + roomIdPart2;
    };
    Lobby.prototype.roomMouseMove = function (event, hover) {
        var target = event.target;
        var wrapper = target.closest(".lobby__room-wrapper");
        var children = wrapper === null || wrapper === void 0 ? void 0 : wrapper.children;
        if (children && children[0]) {
            var id = children[0].id;
            this.setRoomProperty(id, "hover", hover);
        }
    };
    Lobby.prototype.componentWillUnmount = function () {
        document.removeEventListener('click', this.handleOutsidePlayersClick);
        main_1.socket.off("players_update");
        main_1.socket.off("get_room");
    };
    Lobby.prototype.render = function () {
        var _this = this;
        var player = this.state.players.find(function (player) { return player.name == _this.props.name; });
        var rooms = this.state.rooms.map(function (room, id) {
            var roomClass = "";
            if (room.name == _this.state.currentRoom.name) {
                roomClass = "lobby__room--current";
            }
            if (room.unread) {
                roomClass += " lobby__room--unread";
            }
            var closeRoomClass = "";
            if (room.hover) {
                closeRoomClass = "lobby__close-room--visible";
            }
            else {
                closeRoomClass = "lobby__close-room--hidden";
            }
            return react_1.default.createElement("div", { className: "lobby__room-wrapper", key: id, onMouseOver: _this.handleMouseOverRoom, onMouseLeave: _this.handleMouseLeaveRoom },
                react_1.default.createElement("div", { className: "lobby__room no-select " + roomClass, id: room.id, key: id, onClick: _this.handleSwitchRoom }, room.name),
                room.id != "global" && react_1.default.createElement("div", { className: "lobby__close-room " + closeRoomClass, onClick: _this.handleClickCloseRoom },
                    react_1.default.createElement("i", { className: "icon-cancel-circled" })));
        });
        var newRoomButtonClass = "";
        if (this.state.roomInvitable) {
            newRoomButtonClass = "lobby__new-room-button--green";
        }
        return (react_1.default.createElement("div", { className: "lobby" },
            react_1.default.createElement("div", { className: "lobby__invite-button" }, "Invite"),
            react_1.default.createElement("div", { className: "lobby__players", ref: this.playersRef },
                react_1.default.createElement(players_1.default, { players: this.state.players, invitable: this.state.roomInvitable, handlePlayerInvite: this.handlePlayerInvite, rooms: this.state.rooms }),
                ";"),
            react_1.default.createElement("div", { className: "lobby__rooms" },
                rooms,
                react_1.default.createElement("div", { className: "lobby__new-room-button no-select " + newRoomButtonClass, onClick: this.handleClickNewRoom, ref: this.createRoomRef },
                    react_1.default.createElement("i", { className: "icon-user-plus" }))),
            player && react_1.default.createElement(chat_1.default, { player: player, currentRoom: this.state.currentRoom, createRoom: this.createRoom, rooms: this.state.rooms, setRoomProperty: this.setRoomProperty })));
    };
    return Lobby;
}(react_1.default.Component));
exports.default = Lobby;
//# sourceMappingURL=lobby.js.map