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
var Message_1 = __importDefault(require("./Message"));
var main_1 = require("../../main");
var Emojis_1 = __importDefault(require("./Emojis"));
;
;
;
;
var Chat = /** @class */ (function (_super) {
    __extends(Chat, _super);
    function Chat(props) {
        var _this = _super.call(this, props) || this;
        _this.sendMesage = function () {
            var _a;
            if (_this.state.message.replace(/\s/g, "").length) {
                main_1.socket.emit("done_writing", _this.props.currentRoom);
                var message = {
                    content: _this.state.message,
                    author: _this.props.player,
                    room: _this.props.currentRoom,
                };
                main_1.socket.emit("send_message", message);
                _this.setState(function (prev) {
                    return {
                        messages: __spreadArray(__spreadArray([], prev.messages, true), [
                            {
                                content: _this.state.message,
                                author: _this.props.player,
                                room: _this.props.currentRoom,
                            },
                        ], false),
                        message: "",
                    };
                });
                _this.scrollToBot();
            }
            (_a = document.getElementById("input")) === null || _a === void 0 ? void 0 : _a.focus();
        };
        _this.onChangeHandler = function (event) {
            var target = event.target;
            _this.setState({ message: target.value });
            main_1.socket.emit("writing", _this.props.currentRoom);
            setTimeout(function () {
                main_1.socket.emit("done_writing", _this.props.currentRoom);
            }, 4000);
        };
        _this.handleEnter = function (event) {
            if (event.key == "Enter") {
                _this.sendMesage();
            }
        };
        _this.toggleEmojis = function () {
            if (_this.state.showEmojis) {
                _this.setState({ showEmojis: false });
            }
            else {
                _this.setState({ showEmojis: true });
            }
        };
        _this.pickEmoji = function (emoji) {
            _this.setState(function (prevState) {
                return {
                    message: prevState.message + " " + emoji + " ",
                };
            });
        };
        _this.handleOutsideClick = function (event) {
            var target = event.target;
            if (!target.closest(".lobby__emoji-container") &&
                !target.closest(".lobby__emo-button")) {
                _this.setState({ showEmojis: false });
            }
        };
        _this.state = {
            messages: [],
            message: "",
            showEmojis: false,
        };
        _this.thisPlayerId = main_1.socket.id;
        _this.messagesDivRef = react_1.default.createRef();
        _this.emoContainerDivRef = react_1.default.createRef();
        return _this;
    }
    Chat.prototype.scrollToBot = function () {
        if (this.messagesDivRef.current) {
            this.messagesDivRef.current.scrollBy({
                top: this.messagesDivRef.current.scrollHeight + 9999,
            });
        }
    };
    Chat.prototype.receiveMessage = function (message) {
        if (!this.props.rooms.some(function (room) { return room.id == message.room.id; })) {
            this.props.createRoom(message.author.name);
        }
        if (message.room.id !== this.props.currentRoom.id) {
            this.props.setRoomProperty(message.room.id, "unread", true);
        }
        this.setState(function (prevState) {
            return {
                messages: __spreadArray(__spreadArray([], prevState.messages, true), [message], false),
            };
        });
        this.scrollToBot();
    };
    Chat.prototype.setEmojiBottom = function () {
        if (this.emoContainerDivRef.current && this.messagesDivRef.current) {
            this.emoContainerDivRef.current.setAttribute("style", "top: " + (this.messagesDivRef.current.scrollHeight - 85) + "px");
            console.log("to bottom");
        }
    };
    Chat.prototype.componentDidMount = function () {
        var _this = this;
        main_1.socket.on("get_message", function (msg) {
            _this.receiveMessage(msg);
        });
        document.addEventListener("keydown", this.handleEnter);
        document.addEventListener("click", this.handleOutsideClick);
    };
    Chat.prototype.componentWillUnmount = function () {
        document.removeEventListener("keydown", this.handleEnter);
        main_1.socket.off();
        document.removeEventListener("click", this.handleOutsideClick);
    };
    Chat.prototype.componentDidUpdate = function () {
        this.scrollToBot();
        this.setEmojiBottom();
    };
    Chat.prototype.render = function () {
        var _this = this;
        var messages = this.state.messages.map(function (msg, id) {
            if (msg.room.id == _this.props.currentRoom.id) {
                return (react_1.default.createElement(Message_1.default, { author: msg.author, content: msg.content, key: id, thisPlayerId: _this.thisPlayerId }));
            }
        });
        var emoButtonClass = this.state.showEmojis ? "white color-black" : "";
        return (react_1.default.createElement("div", { className: "lobby__chat" },
            react_1.default.createElement("div", { className: "lobby__messages", ref: this.messagesDivRef },
                messages,
                this.props.isWriting && (react_1.default.createElement("div", { className: "lobby__someone-writing" },
                    "Someone is writing",
                    react_1.default.createElement("div", { className: "lobby__dot-wrapper lobby__dot-wrapper--1" },
                        react_1.default.createElement("div", { id: "dot-1", className: "lobby__dot" })),
                    react_1.default.createElement("div", { id: "dot-wrapper-2", className: "lobby__dot-wrapper" },
                        react_1.default.createElement("div", { id: "dot-2", className: "lobby__dot" })),
                    react_1.default.createElement("div", { id: "dot-wrapper-3", className: "lobby__dot-wrapper" },
                        react_1.default.createElement("div", { id: "dot-3", className: "lobby__dot" })))),
                this.state.showEmojis && (react_1.default.createElement(Emojis_1.default, { pickEmoji: this.pickEmoji, emoContainerDivRef: this.emoContainerDivRef }))),
            react_1.default.createElement("input", { className: "lobby__input", type: "text", onChange: this.onChangeHandler, value: this.state.message, autoComplete: "off" }),
            react_1.default.createElement("div", { className: "lobby__emo-button no-select " + emoButtonClass, onClick: this.toggleEmojis },
                react_1.default.createElement("i", { className: "icon-emo-happy" })),
            react_1.default.createElement("div", { className: "lobby__send-button no-select", onClick: this.sendMesage },
                react_1.default.createElement("i", { className: "icon-right-open-outline" }))));
    };
    return Chat;
}(react_1.default.Component));
exports.default = Chat;
//# sourceMappingURL=Chat.js.map