"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reverseChessboard(chessboard) {
    var reversedChessboard = JSON.parse(JSON.stringify(chessboard));
    for (var i = 0; i < chessboard.length; i++) {
        reversedChessboard[i].piece = chessboard[chessboard.length - i - 1].piece;
        reversedChessboard[i].queen = chessboard[chessboard.length - i - 1].queen;
    }
    return reversedChessboard;
}
exports.default = reverseChessboard;
//# sourceMappingURL=reverseChessboard.js.map