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
var Lobby = /** @class */ (function (_super) {
    __extends(Lobby, _super);
    function Lobby() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lobby.prototype.render = function () {
        var players = [];
        for (var i = 0; i < 11; i++) {
            players.push(react_1.default.createElement("div", { id: "player1", className: "player" },
                react_1.default.createElement("div", { className: "avatar" },
                    react_1.default.createElement("img", { className: "avatarImg", src: "http://tinygraphs.com/squares/Konrad?theme=seascape&numcolors=4&size=220&fmt=svg" })),
                react_1.default.createElement("span", { className: "playerName" }, "Name")));
        }
        return (react_1.default.createElement("div", { id: "lobby" },
            react_1.default.createElement("div", { id: "players" },
                players,
                ";"),
            react_1.default.createElement("div", { id: "chat" },
                react_1.default.createElement("div", { id: "messages" },
                    react_1.default.createElement("div", { className: "message" },
                        react_1.default.createElement("div", { className: "author" },
                            react_1.default.createElement("div", { id: "player1", className: "author" },
                                react_1.default.createElement("div", { className: "avatar-div-chat" },
                                    react_1.default.createElement("img", { className: "avatar-chat", src: "http://tinygraphs.com/squares/Konrad?theme=seascape&numcolors=4&size=220&fmt=svg" })),
                                react_1.default.createElement("span", { className: "author-name" }, "Name:"))),
                        react_1.default.createElement("div", { className: "content" }, "dlsaldasldlsaldsaldlsa"))),
                react_1.default.createElement("div", { id: "input" },
                    react_1.default.createElement("input", { type: "text" })),
                react_1.default.createElement("div", { id: "sendButton" }))));
    };
    return Lobby;
}(react_1.default.Component));
exports.default = Lobby;
//# sourceMappingURL=lobby.js.map