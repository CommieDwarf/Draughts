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
var avatar_1 = __importDefault(require("./avatar"));
var emojis_1 = require("./emojis");
var emojis_2 = require("./emojis");
var Message = /** @class */ (function (_super) {
    __extends(Message, _super);
    function Message(props) {
        var _this = _super.call(this, props) || this;
        _this.props = props;
        return _this;
    }
    Message.prototype.render = function () {
        var author = this.props.author;
        var text = this.props.content.split(" ");
        var message = [];
        for (var i = 0; i < text.length; i++) {
            if (emojis_2.emojis.includes(text[i])) {
                message.push(react_1.default.createElement("div", { className: "emoji-wrapper" },
                    react_1.default.createElement("img", { src: emojis_1.path + text[i] + ".png", className: "text-emoji", key: i })));
            }
            else {
                message.push(react_1.default.createElement("span", { key: i }, text[i] + " "));
            }
        }
        var msgAuthorClass = "";
        if (this.props.thisPlayerId == this.props.author.id) {
            msgAuthorClass = "color-white";
        }
        return (react_1.default.createElement("div", { className: "message" },
            react_1.default.createElement("div", { className: "message-author" },
                react_1.default.createElement("div", { id: "player1", className: "message-author" },
                    react_1.default.createElement(avatar_1.default, { shape: author.avatar.shape, theme: author.avatar.theme, name: author.name, small: true }),
                    react_1.default.createElement("span", { className: "author-name " + msgAuthorClass },
                        this.props.author.name,
                        ":"))),
            react_1.default.createElement("div", { className: "message-content " }, message)));
    };
    return Message;
}(react_1.default.Component));
exports.default = Message;
//# sourceMappingURL=message.js.map