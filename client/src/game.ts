import Bot from "./bot";
import { Engine } from "./engine";
import createChessboard from "./createChessboard";
import { SIDE } from "./config";

export const enum GAMEMODE {
  LOCAL,
  BOT,
  ONLINE
}

type Color = "black" | "white";

export default class Game {

  engine: Engine;
  bot: Bot;
  gameMode: GAMEMODE;
  playerColor: Color;
  botColor: Color;
  side: SIDE;
  label: string;
  id: number;
  roomId?: string;

  constructor(gameMode: GAMEMODE, playerColor: Color, side: SIDE, label: string, id: number, roomId?: string) {
    this.engine = new Engine(side);
    this.botColor = playerColor == "white" ? "black" : "white";
    this.bot = new Bot(this.engine, this.botColor);
    this.gameMode = gameMode;
    this.playerColor = playerColor;
    this.side = side;
    this.label = label;
    this.engine.chessboard = this.startNewGame();
    this.id = id;
    this.roomId = roomId;
  }

  startNewGame() {
    this.engine.chessboard = createChessboard(this.side);
    if (this.playerColor == "black" && this.gameMode == GAMEMODE.BOT) {
      this.bot.makeMove(this.engine.chessboard);
    }
    return this.engine.chessboard;
  }

  async clickHandler(event: any) {
    let engine = this.engine
    if (this.gameMode == GAMEMODE.ONLINE && engine.turn !== this.playerColor) {
      return;
    }

    if (!(this.gameMode == GAMEMODE.BOT && engine.turn !== this.playerColor)) {
      if (!(event.target instanceof Element)) {
        return;
      }
      let square = event.target.closest(".chessboard__square");
      if (square) {
        if (!square.getAttribute("id")) {
          return;
        }
        let squareId = square.getAttribute("id");
        if (!squareId) {
          return
        }
        let board = JSON.stringify(this.engine.chessboard);
        engine.performAction(parseInt(squareId), engine.chessboard);
        if (board == JSON.stringify(this.engine.chessboard)) {
          return;
        }
        if (engine.turn == this.bot.color && this.gameMode == GAMEMODE.BOT) {
          await sleep(2000);
          this.bot.makeMove(this.engine.chessboard);
          this.engine.setWinner(this.engine.chessboard, this.engine.turn, this.engine.playerSide);
        }

      } else {
        engine.unselectPiece();
      }

    }

  }
}


function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}