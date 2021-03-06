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
var Chessboard_1 = __importDefault(require("./board/Chessboard"));
;
;
var GamePreview = /** @class */ (function (_super) {
    __extends(GamePreview, _super);
    function GamePreview(props) {
        var _this = _super.call(this, props) || this;
        _this.handleScroll = function (event) {
            var _a, _b;
            if (event.deltaY < 0) {
                (_a = _this.gamePreviewRef.current) === null || _a === void 0 ? void 0 : _a.scrollBy(-30, 0);
            }
            else if (event.deltaY > 0) {
                (_b = _this.gamePreviewRef.current) === null || _b === void 0 ? void 0 : _b.scrollBy(30, 0);
            }
            return false;
        };
        _this.gamePreviewRef = react_1.default.createRef();
        _this.state = {
            mouseOver: false,
        };
        return _this;
    }
    GamePreview.prototype.render = function () {
        var _this = this;
        var games = this.props.games.map(function (game, i) {
            var current = false;
            if (game == _this.props.currentGame) {
                current = true;
            }
            return (react_1.default.createElement(Chessboard_1.default, { engine: game.engine, preview: true, key: i, label: game.label, game: game, closeGame: _this.props.closeGame, switchGame: _this.props.switchGame, current: current }));
        });
        return (react_1.default.createElement("div", { className: "game-preview", onWheel: this.handleScroll, ref: this.gamePreviewRef }, games));
    };
    return GamePreview;
}(react_1.default.Component));
exports.default = GamePreview;
//# sourceMappingURL=GamePreview.js.map