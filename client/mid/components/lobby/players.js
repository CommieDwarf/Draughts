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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var avatar_1 = __importDefault(require("./avatar"));
var main_1 = require("../../main");
var Players = /** @class */ (function (_super) {
    __extends(Players, _super);
    function Players(props) {
        var _this = _super.call(this, props) || this;
        _this.props = props;
        return _this;
    }
    Players.prototype.render = function () {
        var _this = this;
        var players = this.props.players.map(function (player, id) {
            var theme = player.avatar.theme;
            var shape = player.avatar.shape;
            var name = player.name;
            var spanClass = "";
            if (main_1.socket.id == player.id) {
                spanClass = "lobby__player--current";
            }
            return (react_1.default.createElement("div", { className: "lobby__player ", key: id, id: player.name, onClick: _this.props.handlePlayerInvite },
                react_1.default.createElement(avatar_1.default, { name: name, shape: shape, theme: theme, invitable: _this.props.invitable }),
                react_1.default.createElement("span", { className: "player-name " + spanClass }, player.name)));
        });
        return (react_1.default.createElement(react_1.default.Fragment, null, players));
    };
    return Players;
}(react_1.Component));
exports.default = Players;
//# sourceMappingURL=players.js.map