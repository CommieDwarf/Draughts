"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ContextMenuListener = /** @class */ (function () {
    function ContextMenuListener(chessboardDIV, chessboard) {
        this.chessboardDiv = chessboardDIV;
        this.chessboard = chessboard;
    }
    ContextMenuListener.prototype.addContextMenu = function () {
        var _this = this;
        var piece;
        var queen;
        var i;
        var props = { piece: "string", queen: true, i: 1, clientX: 0, clientY: 0 };
        this.chessboardDiv.addEventListener("contextmenu", function (event) {
            if (event.target instanceof Element) {
                var square = event.target.closest(".square");
                if (square) {
                    var clientX = event.clientX;
                    var clientY = event.clientY;
                    var contextMenu = document.getElementById('contextMenu');
                    contextMenu === null || contextMenu === void 0 ? void 0 : contextMenu.setAttribute("style", "left:" + clientX + "px; top:" + clientY + "px; visibility: visible");
                    var id = square.getAttribute('id');
                    if (id !== null) {
                        i = parseInt(id);
                        piece = _this.chessboard[i]["piece"];
                        queen = _this.chessboard[i]["queen"];
                        props = { i: i, piece: piece, queen: queen, clientX: clientX, clientY: clientY };
                        console.log(piece);
                    }
                }
            }
            event.preventDefault();
            return false;
        });
        return props;
    };
    return ContextMenuListener;
}());
exports.default = ContextMenuListener;
/* f (event.target instanceof Element) {
          let square = event.target.closest(".square");
          if (square) {
            if (square.getAttribute("id")) {
              let squareId = square.getAttribute("id");
              if (squareId) {
                  */
//# sourceMappingURL=context-menu-listener.js.map