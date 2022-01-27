"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPieceJSX = void 0;
var react_1 = __importDefault(require("react"));
function getPieceJSX(color, type, queen) {
    if (queen === void 0) { queen = false; }
    if (!color) {
        return react_1.default.createElement("div", null);
    }
    var _a = getSpecialClass(type, color), baseClass = _a[0], centerClass = _a[1];
    var piece;
    if (queen) {
        piece = getQueen(color, type);
    }
    else {
        switch (color) {
            case "black":
                piece = (react_1.default.createElement("div", { className: "piece piece--black " + baseClass },
                    " ",
                    react_1.default.createElement("div", { className: "piece__center piece__center--black " + centerClass }, " "),
                    " "));
                break;
            case "white":
                piece = (react_1.default.createElement("div", { className: "piece piece--white " + baseClass },
                    " ",
                    react_1.default.createElement("div", { className: "piece__center piece__center--white " + centerClass }, " "),
                    " "));
                break;
        }
    }
    return piece;
}
exports.getPieceJSX = getPieceJSX;
function getQueen(color, type) {
    var _a = getSpecialClass(type, color), baseClass = _a[0], centerClass = _a[1];
    if (color == "white") {
        return (react_1.default.createElement("div", { className: "piece piece--white " + baseClass },
            react_1.default.createElement("div", { className: "piece__center piece__center--white " + centerClass },
                react_1.default.createElement("div", { className: "pionowa-lewa" }),
                react_1.default.createElement("div", { className: "pionowa-srodkowa" }),
                react_1.default.createElement("div", { className: "pionowa-prawa" }),
                react_1.default.createElement("div", { className: "pozioma-belka" },
                    react_1.default.createElement("div", { className: "cien-kula1 cien-white cien-kula" }),
                    react_1.default.createElement("div", { className: "cien-kula2 cien-white cien-kula" }),
                    react_1.default.createElement("div", { className: "cien-kula3 cien-white cien-kula" })),
                react_1.default.createElement("div", { className: "cien1 cien-white cien" }),
                react_1.default.createElement("div", { className: "cien2 cien-white cien" }),
                react_1.default.createElement("div", { className: "cien3 cien-white cien" }))));
    }
    else {
        return (react_1.default.createElement("div", { className: "piece piece--black " + baseClass },
            react_1.default.createElement("div", { className: "piece__center piece__center--black " + centerClass },
                react_1.default.createElement("div", { className: "pionowa-lewa black-crown pionowa-lewa-czarna" }),
                react_1.default.createElement("div", { className: "pionowa-srodkowa black-crown pionowa-srodkowa-czarna" }),
                react_1.default.createElement("div", { className: "pionowa-prawa black-crown pionowa-prawa-czarna" }),
                react_1.default.createElement("div", { className: "pozioma-belka black-crown pozioma-belka-czarna" },
                    react_1.default.createElement("div", { className: "cien-kula1 cien-black cien-kula" }),
                    react_1.default.createElement("div", { className: "cien-kula2 cien-black cien-kula" }),
                    react_1.default.createElement("div", { className: "cien-kula3 cien-black cien-kula" })),
                react_1.default.createElement("div", { className: "cien1 cien-black cien" }),
                react_1.default.createElement("div", { className: "cien2 cien-black cien" }),
                react_1.default.createElement("div", { className: "cien3 cien-black cien" }))));
    }
}
function getSpecialClass(type, color) {
    var baseClass = "";
    var centerClass = "";
    if (color == "white") {
        switch (type) {
            case "selected":
                baseClass = "piece--white-selected";
                centerClass = "piece__center--white-selected";
                break;
            case "locked":
                baseClass = "piece--white-locked";
                centerClass = "piece__center--white-locked";
                break;
            case "killable":
                baseClass = "piece--white-killable";
                centerClass = "piece__center--white-killable";
                break;
            default:
                baseClass = "";
                centerClass = "";
                break;
        }
    }
    else {
        switch (type) {
            case "selected":
                baseClass = "piece--black-selected";
                centerClass = "piece__center--black-selected";
                break;
            case "killable":
                baseClass = "piece--black-killable";
                centerClass = "piece__center--black-killable";
                break;
            case "locked":
                baseClass = "piece--black-locked";
                centerClass = "piece__-center-black-locked";
                break;
            default:
                baseClass = "";
                centerClass = "";
                break;
        }
    }
    return [baseClass, centerClass];
}
//# sourceMappingURL=getPieceJSX.js.map