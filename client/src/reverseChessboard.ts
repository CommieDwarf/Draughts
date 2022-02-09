
interface ISquare {
    id: number;
    piece: "black" | "white" | "";
    square: string;
    "border-top": boolean
    "border-left": boolean
    "border-right": boolean
    "border-bot": boolean
    queen: boolean;
  }

export default function reverseChessboard(chessboard: ISquare[]) {
    const reversedChessboard: ISquare[] = JSON.parse(JSON.stringify(chessboard));
    for (let i = 0 ; i < chessboard.length; i++) {
        reversedChessboard[i].piece = chessboard[chessboard.length - i - 1].piece;
        reversedChessboard[i].queen = chessboard[chessboard.length - i - 1].queen;
    }

    return reversedChessboard;
}