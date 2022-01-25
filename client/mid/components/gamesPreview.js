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
var GamesPreview = /** @class */ (function (_super) {
    __extends(GamesPreview, _super);
    function GamesPreview(props) {
        var _this = _super.call(this, props) || this;
        _this.onClickHandler = function (event) {
            var target = event.target;
            var chessboard = target.closest('.chessboard');
            if (chessboard) {
                var id = chessboard.id.slice(-1);
                _this.props.switchGame(id);
            }
            _this.forceUpdate();
        };
        _this.props = props;
        return _this;
    }
    GamesPreview.prototype.render = function () {
        var games = this.props.games.map(function (game, i) {
            return react_1.default.createElement(chessboard_1.default, { engine: game.engine, preview: true, key: i, id: game.id, label: game.label, game: game });
        });
        return (react_1.default.createElement("div", { id: "games-preview", onClick: this.onClickHandler }, games));
    };
    return GamesPreview;
}(react_1.default.Component));
exports.default = GamesPreview;
//# sourceMappingURL=gamesPreview.js.map