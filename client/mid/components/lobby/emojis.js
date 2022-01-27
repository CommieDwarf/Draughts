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
Object.defineProperty(exports, "__esModule", { value: true });
exports.emojis = exports.path = void 0;
var react_1 = __importStar(require("react"));
var path = "./img/emojis/";
exports.path = path;
var emojis = ["10of10", "Clap", "Cry", "Facepalm", "Glasses", "Hacker", "Hands", "Help", "Hmmm", "KEKW",
    "KingCry", "Restless", "Sleep", "Susp", "Think"];
exports.emojis = emojis;
var Emojis = /** @class */ (function (_super) {
    __extends(Emojis, _super);
    function Emojis(props) {
        var _this = _super.call(this, props) || this;
        _this.onClickHandler = function (event) {
            var target = event.target;
            var emoji = target.alt;
            _this.props.pickEmoji(emoji);
        };
        _this.props = props;
        _this.containerRef = react_1.default.createRef();
        return _this;
    }
    Emojis.prototype.render = function () {
        var _this = this;
        var imgs = emojis.map(function (emoji, id) { return react_1.default.createElement("img", { className: "lobby__emoji", key: id, src: path + emoji + ".png", alt: emoji, onClick: _this.onClickHandler }); });
        return (react_1.default.createElement("div", { className: "lobby__emoji-container", ref: this.containerRef }, imgs));
    };
    return Emojis;
}(react_1.Component));
exports.default = Emojis;
//# sourceMappingURL=emojis.js.map