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
var InputName = /** @class */ (function (_super) {
    __extends(InputName, _super);
    function InputName(props) {
        var _this = _super.call(this, props) || this;
        _this.onChangeHandler = function (e) {
            var target = e.target;
            _this.props.setName(target.value);
        };
        return _this;
    }
    InputName.prototype.render = function () {
        return (react_1.default.createElement("div", { className: "app__input-name no-select" },
            react_1.default.createElement("label", { htmlFor: "name" },
                react_1.default.createElement("h1", null, "Enter your name:")),
            react_1.default.createElement("br", null),
            react_1.default.createElement("input", { type: "text", id: "name", maxLength: 6, onChange: this.onChangeHandler }),
            react_1.default.createElement("div", { className: "app__name-error" }, this.props.error)));
    };
    return InputName;
}(react_1.default.Component));
exports.default = InputName;
//# sourceMappingURL=InputName.js.map