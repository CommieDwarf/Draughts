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
var message_1 = __importDefault(require("./message"));
var main_1 = require("../../main");
var emojis_1 = __importDefault(require("./emojis"));
var Chat = /** @class */ (function (_super) {
    __extends(Chat, _super);
    function Chat(props) {
        var _this = _super.call(this, props) || this;
        _this.sendMesage = function () {
            var _a;
            if (_this.state.message.replace(/\s/g, '').length) {
                main_1.socket.emit("done_writing");
                main_1.socket.emit("send_message", { content: _this.state.message, author: _this.props.player, room: _this.props.currentRoom });
                _this.setState(function (prev) {
                    return {
                        messages: __spreadArray(__spreadArray([], prev.messages, true), [{ content: _this.state.message, author: _this.props.player, room: _this.props.currentRoom }], false),
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
            main_1.socket.emit("writing");
            setTimeout(function () {
                main_1.socket.emit("done_writing");
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
                    message: prevState.message + " " + emoji + " "
                };
            });
        };
        _this.handleOutsideClick = function (event) {
            var target = event.target;
            if (!target.closest('.lobby__emoji-container') && !target.closest(".lobby__emo-button")) {
                _this.setState({ showEmojis: false });
            }
        };
        _this.props = props;
        _this.state = {
            messages: [],
            message: "",
            someoneWriting: false,
            showEmojis: false,
        };
        _this.thisPlayerId = main_1.socket.id;
        return _this;
    }
    Chat.prototype.scrollToBot = function () {
        var msgsDiv = document.getElementById('messages');
        if (msgsDiv) {
            msgsDiv.scrollBy({ top: msgsDiv.scrollHeight + 9999 });
        }
    };
    Chat.prototype.receiveMessage = function (message) {
        this.setState(function (prevState) {
            return {
                messages: __spreadArray(__spreadArray([], prevState.messages, true), [message], false)
            };
        });
        this.scrollToBot();
    };
    Chat.prototype.setEmojiBottom = function () {
        var emoContainer = document.getElementById('emoji-container');
        var msgsDiv = document.getElementById('messages');
        if (emoContainer && msgsDiv) {
            emoContainer.setAttribute("style", "top: " + (msgsDiv.scrollHeight - 85) + "px");
        }
    };
    Chat.prototype.componentDidMount = function () {
        var _this = this;
        document.addEventListener("keydown", this.handleEnter);
        main_1.socket.on("get_message", function (message) {
            _this.receiveMessage(message);
        });
        main_1.socket.on("someone_writing", function () {
            _this.setState({ someoneWriting: true });
        });
        main_1.socket.on("done_writing", function () {
            _this.setState({ someoneWriting: false });
        });
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
            if (msg.room == _this.props.currentRoom) {
                return (react_1.default.createElement(message_1.default, { author: msg.author, content: msg.content, key: id, thisPlayerId: _this.thisPlayerId }));
            }
        });
        var emoButtonClass = this.state.showEmojis ? "white color-black" : "";
        return (react_1.default.createElement("div", { className: "lobby__chat" },
            react_1.default.createElement("div", { className: "lobby__messages" },
                messages,
                this.state.someoneWriting && react_1.default.createElement("div", { className: "lobby__someone-writing" },
                    "Someone is writing",
                    react_1.default.createElement("div", { className: "lobby__dot-wrapper lobby__dot-wrapper--1" },
                        react_1.default.createElement("div", { id: "dot-1", className: "lobby__dot" })),
                    react_1.default.createElement("div", { id: "dot-wrapper-2", className: "lobby__dot-wrapper" },
                        react_1.default.createElement("div", { id: "dot-2", className: "lobby__dot" })),
                    react_1.default.createElement("div", { id: "dot-wrapper-3", className: "lobby__dot-wrapper" },
                        react_1.default.createElement("div", { id: "dot-3", className: "lobby__dot" }))),
                this.state.showEmojis && react_1.default.createElement(emojis_1.default, { pickEmoji: this.pickEmoji })),
            react_1.default.createElement("input", { className: "lobby__input", type: "text", onChange: this.onChangeHandler, value: this.state.message, autoComplete: "off" }),
            react_1.default.createElement("div", { className: "lobby__emo-button no-select " + emoButtonClass, onClick: this.toggleEmojis },
                react_1.default.createElement("i", { className: "icon-emo-happy" })),
            react_1.default.createElement("div", { className: "lobby__send-button no-select", onClick: this.sendMesage },
                react_1.default.createElement("i", { className: "icon-right-open-outline" }))));
    };
    return Chat;
}(react_1.default.Component));
exports.default = Chat;
//# sourceMappingURL=chat.js.map