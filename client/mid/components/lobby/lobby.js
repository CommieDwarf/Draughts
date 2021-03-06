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
var Chat_1 = __importDefault(require("./Chat"));
var main_1 = require("../../main");
var Players_1 = __importDefault(require("./Players"));
var Room_1 = __importDefault(require("./Room"));
var GameInvitation_1 = __importDefault(require("./GameInvitation"));
var GameInvSent_1 = __importDefault(require("./GameInvSent"));
;
;
;
var Lobby = /** @class */ (function (_super) {
    __extends(Lobby, _super);
    function Lobby(props) {
        var _this = _super.call(this, props) || this;
        _this.handleClickInvite = function () {
            _this.setState({ gameInvitable: true });
        };
        _this.createRoom = function (name) {
            var roomId = _this.getRoomId(name);
            if (!_this.state.rooms.some(function (room) { return room.name == name; }) &&
                name !== _this.props.name) {
                var room = { author: _this.props.name, target: name, id: roomId };
                main_1.socket.emit("join_room", room);
                main_1.socket.emit("create_room", room);
                _this.setState(function (prevState) {
                    var room = {
                        name: name,
                        id: roomId,
                        unread: false,
                        hover: false,
                        isWriting: false,
                    };
                    return {
                        rooms: __spreadArray(__spreadArray([], prevState.rooms, true), [room], false),
                        currentRoom: room,
                        roomInvitable: false,
                    };
                });
            }
        };
        _this.closeRoom = function (name) {
            _this.setState(function (prevState) {
                return {
                    rooms: prevState.rooms.filter(function (room) { return room.name != name; }),
                };
            });
        };
        _this.acceptChallange = function (name, gameId, roomId) {
            var randomNum = Math.floor(Math.random() * 2);
            var authorColor;
            if (randomNum == 0) {
                authorColor = "white";
            }
            else {
                authorColor = "black";
            }
            var side = authorColor == "white" ? 0 /* NORMAL */ : 1 /* REVERSED */;
            _this.props.startNewGame(2 /* ONLINE */, side, authorColor, name, gameId, roomId);
            var gameInfo = {
                roomId: roomId,
                gameId: gameId,
                playerAccepted: _this.props.name,
                playerAcceptedColor: authorColor,
            };
            main_1.socket.emit("accept_challange", gameInfo);
            _this.filterOutGameInvites(name);
        };
        _this.filterOutGameInvites = function (name) {
            _this.setState(function (prevState) {
                return {
                    gameInvitations: prevState.gameInvitations.filter(function (inv) { return inv.author != name; }),
                };
            });
        };
        _this.filterOutSentInvites = function (name) {
            _this.setState(function (prevState) {
                return {
                    gameInvSent: prevState.gameInvSent.filter(function (inv) { return inv.target != name; }),
                };
            });
        };
        _this.handlePlayerInvite = function (event) {
            var target = event.target;
            var player = target.closest(".lobby__player");
            if (player &&
                !_this.state.rooms.some(function (room) {
                    room.name == player.id;
                }) &&
                _this.state.roomInvitable) {
                _this.createRoom(player.id);
            }
            if (player && _this.state.gameInvitable && player.id != _this.props.name) {
                var gameRoomId = _this.getGameRoomId(player.id, _this.props.name);
                var gameId = _this.getGameId();
                console.log(player.id);
                main_1.socket.emit("request_join_game", {
                    author: _this.props.name,
                    target: player.id,
                    gameId: gameId,
                });
                main_1.socket.emit("join_game", gameRoomId);
                _this.setState({ gameInvitable: false });
                if (!_this.state.gameInvSent.some(function (inv) { return inv.target == player.id; })) {
                    var inv_1 = {
                        target: player.id,
                        gameId: gameId,
                        author: _this.props.name,
                        roomId: gameRoomId,
                    };
                    _this.setState(function (prevState) {
                        return {
                            gameInvSent: __spreadArray(__spreadArray([], prevState.gameInvSent, true), [inv_1], false),
                        };
                    });
                }
            }
        };
        _this.handleClickNewRoom = function () {
            _this.setState({ roomInvitable: true });
        };
        _this.handleOutsidePlayersClick = function (event) {
            var _a, _b, _c;
            var target = event.target;
            if (!((_a = _this.playersRef.current) === null || _a === void 0 ? void 0 : _a.contains(target))) {
                if (!((_b = _this.createRoomRef.current) === null || _b === void 0 ? void 0 : _b.contains(target))) {
                    _this.setState({ roomInvitable: false });
                }
                if (!((_c = _this.inviteRef.current) === null || _c === void 0 ? void 0 : _c.contains(target))) {
                    _this.setState({ gameInvitable: false });
                }
            }
        };
        _this.switchRoom = function (room) {
            if (room.id !== "global") {
                _this.setState({ currentRoom: room });
            }
            else {
                _this.setState(function (prevState) {
                    return {
                        currentRoom: prevState.rooms[0],
                    };
                });
            }
            _this.setRoomProperty(room.id, "unread", false);
        };
        _this.setRoomProperty = function (id, propertyName, propertyValue) {
            var rooms = _this.state.rooms.filter(function (room) { return room.id == id; });
            var room = rooms[0];
            if (room instanceof Object && room) {
                Object.defineProperty(room, propertyName, { value: propertyValue });
                var index_1 = _this.state.rooms.findIndex(function (room) { return room.id == id; });
                _this.setState(function (prevState) {
                    return {
                        rooms: __spreadArray(__spreadArray(__spreadArray([], prevState.rooms.slice(0, index_1), true), [
                            room
                        ], false), prevState.rooms.slice(index_1 + 1, prevState.rooms.length), true),
                    };
                });
                if (room.id == _this.state.currentRoom.id) {
                    _this.setState({ currentRoom: room });
                }
            }
        };
        _this.handleScroll = function (event) {
            var _a, _b;
            if (event.deltaY < 0) {
                (_a = _this.roomsRef.current) === null || _a === void 0 ? void 0 : _a.scrollBy(-30, 0);
            }
            else if (event.deltaY > 0) {
                (_b = _this.roomsRef.current) === null || _b === void 0 ? void 0 : _b.scrollBy(30, 0);
            }
            return false;
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
            main_1.socket.on("someone_writing", function (room) {
                _this.setRoomProperty(room.id, "isWriting", true);
            });
            main_1.socket.on("done_writing", function (room) {
                _this.setRoomProperty(room.id, "isWriting", false);
            });
            main_1.socket.on("requested_join_game", function (_a) {
                var author = _a.author, gameId = _a.gameId, target = _a.target;
                console.log(target);
                if (_this.props.name == target) {
                    var roomId_1 = _this.getGameRoomId(author, _this.props.name);
                    main_1.socket.emit("join_game", roomId_1);
                    if (!_this.state.gameInvitations.some(function (inv) { return inv.gameId == gameId; })) {
                        _this.setState(function (prevState) {
                            return {
                                gameInvitations: __spreadArray(__spreadArray([], prevState.gameInvitations, true), [
                                    { author: author, gameId: gameId, target: _this.props.name, roomId: roomId_1 },
                                ], false),
                            };
                        });
                    }
                }
            });
            main_1.socket.on("challange_accepted", function (gameInfo) {
                var color;
                color = gameInfo.playerAcceptedColor == "white" ? "black" : "white";
                var side = color == "white" ? 0 /* NORMAL */ : 1 /* REVERSED */;
                _this.props.startNewGame(2 /* ONLINE */, side, color, gameInfo.playerAccepted, gameInfo.gameId, gameInfo.roomId);
                _this.filterOutSentInvites(gameInfo.playerAccepted);
            });
            main_1.socket.on("player_disconnected", function (player) {
                _this.filterOutGameInvites(player.name);
                _this.filterOutSentInvites(player.name);
            });
            document.addEventListener("click", _this.handleOutsidePlayersClick);
        };
        _this.state = {
            players: [],
            currentRoom: {
                name: "global room",
                id: "global",
                unread: false,
                hover: false,
                isWriting: false,
            },
            rooms: [
                {
                    name: "global room",
                    id: "global",
                    unread: false,
                    hover: false,
                    isWriting: false,
                },
            ],
            roomInvitable: false,
            gameInvitable: false,
            gameInvitations: [],
            gameInvSent: [],
        };
        _this.playersRef = react_1.default.createRef();
        _this.createRoomRef = react_1.default.createRef();
        _this.inviteRef = react_1.default.createRef();
        _this.roomsRef = react_1.default.createRef();
        return _this;
    }
    Lobby.prototype.getGameRoomId = function (playerName1, playerName2) {
        if (playerName1 > playerName2) {
            return playerName1 + playerName2 + "-game";
        }
        else {
            return playerName2 + playerName1 + "-game";
        }
    };
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
    Lobby.prototype.getGameId = function () {
        return Date.now();
    };
    Lobby.prototype.componentWillUnmount = function () {
        document.removeEventListener("click", this.handleOutsidePlayersClick);
        main_1.socket.off();
    };
    Lobby.prototype.render = function () {
        var _this = this;
        var player = this.state.players.find(function (player) { return player.name == _this.props.name; });
        var rooms = this.state.rooms.map(function (room, id) {
            return (react_1.default.createElement(Room_1.default, { closeRoom: _this.closeRoom, setRoomProperty: _this.setRoomProperty, switchRoom: _this.switchRoom, room: room, currentRoom: _this.state.currentRoom, key: id }));
        });
        var gameInvitations = this.state.gameInvitations.map(function (inv, i) {
            return (react_1.default.createElement(GameInvitation_1.default, { author: inv.author, gameId: inv.gameId, key: i, target: inv.target, acceptChallange: _this.acceptChallange, roomId: inv.roomId }));
        });
        var gameInvSent = this.state.gameInvSent.map(function (inv, i) {
            return react_1.default.createElement(GameInvSent_1.default, { target: inv.target, key: i });
        });
        var inviteClass = "";
        if (this.state.gameInvitable) {
            inviteClass = "lobby__invite-button--green";
        }
        var newRoomButtonClass = "";
        if (this.state.roomInvitable) {
            newRoomButtonClass = "lobby__new-room-button--green";
        }
        return (react_1.default.createElement("div", { className: "lobby" },
            react_1.default.createElement("div", { className: "lobby__invite-button no-select " + inviteClass, ref: this.inviteRef, onClick: this.handleClickInvite }, "Invite"),
            react_1.default.createElement("div", { className: "lobby__game-invitation" },
                gameInvitations,
                gameInvSent),
            react_1.default.createElement("div", { className: "lobby__players", ref: this.playersRef },
                react_1.default.createElement(Players_1.default, { players: this.state.players, roomInvitable: this.state.roomInvitable, gameInvitable: this.state.gameInvitable, handlePlayerInvite: this.handlePlayerInvite, rooms: this.state.rooms }),
                ";"),
            react_1.default.createElement("div", { className: "lobby__rooms", ref: this.roomsRef, onWheel: this.handleScroll },
                rooms,
                react_1.default.createElement("div", { className: "lobby__new-room-button no-select " + newRoomButtonClass, onClick: this.handleClickNewRoom, ref: this.createRoomRef },
                    react_1.default.createElement("i", { className: "icon-user-plus" }))),
            player && (react_1.default.createElement(Chat_1.default, { player: player, currentRoom: this.state.currentRoom, createRoom: this.createRoom, rooms: this.state.rooms, setRoomProperty: this.setRoomProperty, isWriting: this.state.currentRoom.isWriting }))));
    };
    return Lobby;
}(react_1.default.Component));
exports.default = Lobby;
//# sourceMappingURL=Lobby.js.map