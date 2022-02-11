"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
function Room(props) {
    var room = props.room;
    var handleClickCloseRoom = function (event) {
        props.closeRoom(room.name);
    };
    var handleMouseOver = function (event) {
        roomMouseMove(event, true);
    };
    var handleMouseLeave = function (event) {
        roomMouseMove(event, false);
    };
    var roomMouseMove = function (event, hover) {
        var target = event.target;
        var wrapper = target.closest(".lobby__room-wrapper");
        var children = wrapper === null || wrapper === void 0 ? void 0 : wrapper.children;
        if (children && children[0]) {
            props.setRoomProperty(props.room.id, "hover", hover);
        }
    };
    var handleClickRoom = function (event) {
        props.switchRoom(props.room);
    };
    var roomClass = "";
    if (room.name == props.currentRoom.name) {
        roomClass = "lobby__room--current";
    }
    if (room.unread) {
        roomClass += " lobby__room--unread";
    }
    var closeRoomClass = "";
    if (room.hover) {
        closeRoomClass = "lobby__close-room--visible";
    }
    else {
        closeRoomClass = "lobby__close-room--hidden";
    }
    var globalRoomClass = "";
    if (props.room.name == "global room") {
        console.log('global');
        globalRoomClass = "lobby__room--global";
    }
    return (react_1.default.createElement("div", { className: "lobby__room-wrapper", onMouseOver: handleMouseOver, onMouseLeave: handleMouseLeave },
        react_1.default.createElement("div", { className: "lobby__room no-select " + roomClass + " " + globalRoomClass, onClick: handleClickRoom }, room.name),
        room.id != "global" && (react_1.default.createElement("div", { className: "lobby__close-room " + closeRoomClass, onClick: handleClickCloseRoom },
            react_1.default.createElement("i", { className: "icon-cancel-circled" })))));
}
exports.default = Room;
//# sourceMappingURL=room.js.map