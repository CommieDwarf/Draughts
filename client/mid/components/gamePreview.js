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
var chessboard_1 = __importDefault(require("./board/chessboard"));
var GamePreview = /** @class */ (function (_super) {
    __extends(GamePreview, _super);
    function GamePreview(props) {
        var _this = _super.call(this, props) || this;
        _this.onClickHandler = function (event) {
            var target = event.target;
            var chessboard = target.closest('.chessboard');
            if (chessboard) {
                var id = chessboard.id.slice(-1);
                _this.props.switchGame(id);
            }
        };
        _this.props = props;
        return _this;
    }
    GamePreview.prototype.render = function () {
        var _this = this;
        var games = this.props.games.map(function (game, i) {
            return react_1.default.createElement(chessboard_1.default, { engine: game.engine, preview: true, key: i, gameCounter: game.gameCounter, label: game.label, game: game, closeGame: _this.props.closeGame });
        });
        return (react_1.default.createElement("div", { className: "game-preview", onClick: this.onClickHandler }, games));
    };
    return GamePreview;
}(react_1.default.Component));
exports.default = GamePreview;
//# sourceMappingURL=gamePreview.js.map