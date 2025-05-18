import { number } from "prop-types";
import { setFlagsFromString } from "v8";
import { resourceLimits } from "worker_threads";
import { brotliDecompressSync } from "zlib";
import { gameMode, GameMode, preset } from "./config";
import createChessboard from "./createChessboard";
import * as utility from "./utility"; 

const numOfSquares = 64;

type border = "border-top" | "border-left" | "border-right" | "border-bot";

export interface ISquare {
  id: number;
  piece: "black" | "white" | "";
  square: string;
  "border-top": boolean
  "border-left": boolean
  "border-right": boolean
  "border-bot": boolean
  queen: boolean;
}

// for kill routes tracking
interface IPosition {
  move: number,
  depth: number,
  prev: null | IPosition,
  board: Chessboard,
  visited: Set<number>,
}

type Moves = (number | null)[];
type Turn = "black" | "white";

export type Chessboard = ISquare[];

export class Engine {
  chessboard: Chessboard;
  turn: "black" | "white";
  selectedPiece: number | null;
  playerSide: string;
  availableMoves: Moves;
  selectionLock: boolean;
  lockedPieces: number[];
  killablePieces: Moves;

  constructor() {
    this.chessboard = [];
    this.turn = preset.turn == "black" ? "black" : "white";
    this.selectedPiece = null;
    this.playerSide = preset.playerSide;
    this.availableMoves = [];
    this.selectionLock = false;
    this.lockedPieces = [];
    this.killablePieces = [];
  }

  startNewGame(): void {
    this.chessboard = createChessboard();
  }

  makeChessboardInteractive(chessboard: Chessboard): void {
    let gameDiv = document.getElementById("game");
    if (gameDiv) {
      gameDiv.addEventListener("click", (event) => {
        if (event.target instanceof Element) {
          let square = event.target.closest(".square");
          if (square) {
            if (square.getAttribute("id")) {
              let squareId = square.getAttribute("id");
              if (squareId) {
                this.performAction(parseInt(squareId), this.chessboard);
              }
            }
          } else {
            this.performAction(null, this.chessboard);
          }
        }
      });
    }
  }
  
  
  // main function where piece selection, movment, kills happen
  private performAction(
    clickedSquareId: number | null,
    chessboard: Chessboard
  ): void {

    let piecesWithKill = this.getPiecesWithKill(this.turn, chessboard);
    this.getLongestRoute(piecesWithKill, this.turn, chessboard);

    if (!utility.isEmpty(piecesWithKill)) {
      this.setSelectionLock(true, piecesWithKill);
    }

    this.togglePieceSelection(clickedSquareId);

    if (clickedSquareId) {
      let moves;
      let killablePieces;
      let qMoves;
      let qKillablePieces;

      if (this.selectedPiece && chessboard[this.selectedPiece]["queen"]) {
        [qMoves, qKillablePieces] = this.getQueenMoves(this.selectedPiece, chessboard, this.turn);
        killablePieces = qKillablePieces.flat();
        moves = qMoves.flat();
      } else {
        [moves, killablePieces] = this.getPossibleMoves(
          this.selectedPiece,
          chessboard,
          this.turn
        );
      }
      this.setAvailableMoves(moves);
      this.killablePieces = killablePieces;

      let shouldMove = this.getShouldMove(clickedSquareId, moves);


      if (shouldMove) {
        this.move(this.selectedPiece, clickedSquareId, chessboard);
        
        this.setAvailableMoves(null);

        let killed;
        if (this.selectedPiece) {
          killed = this.kill(
            clickedSquareId,
            moves,
            killablePieces,
            chessboard,
            this.selectedPiece,
          );
        }
        
        this.togglePieceSelection(null, chessboard);

        [moves, killablePieces] = this.getPossibleMoves(
          clickedSquareId,
          chessboard,
          this.turn
        );

        let canKill = this.getKillPosibility(killablePieces);
        if (canKill && killed) {
          this.setAvailableMoves(moves);
          this.setSelectionLock(true, [clickedSquareId]);
          this.togglePieceSelection(clickedSquareId, chessboard);
        } else {
          this.switchTurn();
          this.setSelectionLock(false);
          this.togglePieceSelection(clickedSquareId, chessboard);
          let piecesWithKill = this.getPiecesWithKill(this.turn, chessboard);
          if (!utility.isEmpty(piecesWithKill)) {
            this.setSelectionLock(true, piecesWithKill);
          }
        }
      }
    }
  }


  private getShouldMove(target: number | null, moves: Moves) {
    if (moves.includes(target)) {
      return true;
    } else {
      return false;
    }
  }

  private setSelectionLock(lock: boolean, pieces: number[] = []) {
    this.selectionLock = lock;
    this.lockedPieces = pieces;
  }

  private getKillPosibility(killablePieces: Moves) {
    if (!killablePieces.some((piece) => piece !== null)) {
      return false;
    } else {
      return true;
    }
  }

  private togglePieceSelection(
    squareId: number | null,
    chessboard: Chessboard = this.chessboard
  ): void {
    if (this.availableMoves.includes(squareId)) {
      return;
    }
    if (this.selectionLock && squareId && !this.lockedPieces.includes(squareId)) {
      return;
    }

    if (squareId) {
      let selectedPiece = chessboard[squareId]["piece"];
      if (selectedPiece && selectedPiece !== this.turn) {
        this.selectedPiece = null;
        return;
      }
      if (this.selectedPiece == squareId) {
        this.selectedPiece = null;
        this.setAvailableMoves();
      } else if (!selectedPiece) {
        this.selectedPiece = null;
      } else {
        this.selectedPiece = squareId;
      }
    } else {
      this.selectedPiece = null;
    }
  }

  private getPiecesWithKill(
    turn: "black" | "white",
    chessboard: Chessboard
  ): number[] {
    let piecesWithKill = [];

    for (let i = 0; i < numOfSquares; i++) {
      if (chessboard[i]["piece"] && chessboard[i]["piece"] == turn) {
        if (chessboard[i]["queen"]) {
          let [moves, killablePieces] = this.getQueenMoves(i, chessboard, turn);

        }
        
        let [moves, killablePieces] = this.getNormalMoves(
          i,
          chessboard,
          turn
        );
        if (killablePieces.some((piece) => piece !== null)) {
          piecesWithKill.push(i);
        }
      }
    }
    return piecesWithKill;
  }

  private getPossibleMoves(
    selectedPiece: number | null,
    chessboard: Chessboard,
    turn: "black" | "white"
  ): Moves[] {
    let moves = new Array(4).fill(null);
    let killablePieces = new Array(4).fill(null);
    if (selectedPiece) {
      if (!this.chessboard[selectedPiece]["queen"]) {
        [moves, killablePieces] = this.getNormalMoves(
          selectedPiece,
          chessboard,
          turn
        );
      } else {

        
      }
      return [moves, killablePieces];
    }
    return [moves, killablePieces];
  }

  private getNormalMoves(
    selectedPiece: number,
    chessboard: Chessboard,
    turn: Turn
  ): (null | number)[][] {
    let moves: Moves = [null, null, null, null];
    let moveDirections = this.getMoveDirections(turn);

    moves = this.addMoveDirections(moves, moveDirections, selectedPiece);

    moves = this.filterValidMoves(moves, moveDirections, turn, chessboard);

    let killablePieces = [];

    [moves, killablePieces] = this.getMovesAndKillablePieces(
      moves,
      moveDirections,
      chessboard
    );


    moves[0] = this.checkIfMoveIsBlocked(moves[0], chessboard);
    moves[1] = this.checkIfMoveIsBlocked(moves[1], chessboard);

    moves[2] = killablePieces[2] ? moves[2] : null;
    moves[3] = killablePieces[3] ? moves[3] : null;


    return [moves, killablePieces];
  }

  private filterOutMovesWithoutKill(moves: Moves, killablePieces: Moves) {
    if (killablePieces.some((piece) => piece)) {
      for (let i = 0; i < moves.length; i++) {

        if (!killablePieces[i]) {
          moves[i] = null;
        }
      }
    } else {
      moves.fill(null);
    }
    return moves;
  }

  private getMoveDirections(turn: "black" | "white"): number[] {
    let moveDirection1, moveDirection2;

    if (
      (turn == "white" && +gameMode == GameMode.NORMAL) ||
      (turn == "black" && +gameMode == GameMode.REVERSED) ||
      (+gameMode == GameMode.CUSTOM && turn == "white")
    ) {
      moveDirection1 = -9;
      moveDirection2 = -7;
    } else {
      moveDirection1 = 7;
      moveDirection2 = 9;
    }

    let moveDirections = [
      moveDirection1,
      moveDirection2,
      -moveDirection1,
      -moveDirection2,
    ];

    return moveDirections;
  }

  private addMoveDirections(
    moves: Moves,
    moveDirections: number[],
    selectedPiece: number
  ): Moves {
    for (let i = 0; i < moves.length; i++) {
      moves[i] = selectedPiece + moveDirections[i];
    }
    return moves;
  }

  private filterValidMoves(
    moves: Moves,
    moveDirections: number[],
    turn: Turn,
    chessboard: Chessboard
  ): Moves {
    let output: (null | number)[] = [];
    for (let i = 0; i < moves.length; i++) {
      let move = moves[i];

      if (!move) {
        output.push(null);
        continue;
      } else if (move > 63 || move < 0) {
        output.push(null);
        continue;
      }

      let moveSquare = chessboard[move];
      if (
        moveSquare["border-right"] &&
        (moveDirections[i] == -9 || moveDirections[i] == 7)
      ) {
        output.push(null);
      } else if (
        moveSquare["border-left"] &&
        (moveDirections[i] == -7 || moveDirections[i] == 9)
      ) {
        output.push(null);
      } else if (moveSquare["square"] == "white") {
        output.push(null);
      } else if (
        moveSquare["piece"] &&
        chessboard[move + moveDirections[i]] &&
        chessboard[move + moveDirections[i]]["piece"]
      ) {
        output.push(null);
      } else if (moveSquare["piece"] == turn) {
        output.push(null);
      } else {
        output.push(move);
      }
    }
    return output;
  }

  private getMovesAndKillablePieces(
    moves: Moves,
    moveDirections: number[],
    chessboard: Chessboard
  ): Moves[] {
    let newMoves: Moves = [];
    let killablePieces: Moves = [];

    for (let i = 0; i < moves.length; i++) {
      let moveDirection = moveDirections[i];

      let move = moves[i];

      if (!move) {
        newMoves.push(null);
        killablePieces.push(null);
        continue;
      } else if (move + moveDirection > 63 || move + moveDirection < 0) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      }

      let moveSquare = chessboard[move];

      if (!moveSquare["piece"]) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      } else if (moveSquare["piece"] == this.turn) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      } else if (moveSquare["border-top"] || moveSquare["border-bot"]) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      } else if (
        chessboard[move + moveDirection] &&
        chessboard[move + moveDirection]["piece"]
      ) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      } else if (chessboard[move + moveDirection]["square"] == "white") {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      } else if (
        chessboard[move + moveDirection]["border-right"] &&
        (moveDirection == -9 || moveDirection == 7)
      ) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      } else if (
        chessboard[move + moveDirection]["border-left"] &&
        (moveDirection == -7 || moveDirection == 9)
      ) {
        newMoves.push(move);
        killablePieces.push(null);
        continue;
      }

      let pieceToKill = move;
      move += moveDirection;
      newMoves.push(move);
      killablePieces.push(pieceToKill);
    }
    return [newMoves, killablePieces];
  }

  private checkIfMoveIsBlocked(
    move: number | null,
    chessboard: Chessboard
  ): number | null {
    if (move && chessboard[move]["piece"]) {
      return null;
    } else return move;
  }

  public getQueenMoves(selectedPiece: number, chessboard:Chessboard, turn: Turn) {

    let moves = this.getObliqueMoves(selectedPiece, chessboard);
    moves = this.filterBlockedMoves(chessboard, moves, selectedPiece, turn)
    let [kills, objects] = this.getQueenKillMoves(moves, chessboard, selectedPiece, turn);
    moves = this.removeOponentsPosFromQueenMoves(moves, chessboard, turn);

    

    return [moves, kills, objects]
  }



  private getObliqueMoves(queenPosition: number, chessboard: Chessboard) {

    let allMoves: number[][] = [[],[],[],[]]; 
    let current = queenPosition;

    let borders: border[] = ['border-left', 'border-top', 'border-right', 'border-bot', "border-left"];
    let directions = [-9, - 7 , 9, 7]
    
    for (let i = 0; i < borders.length - 1; i++) {
      let border1 = borders[i];
      let border2 = borders[i + 1];
      let direction = directions[i];

      while (current >= 0 || current <= 63) {
        allMoves[i].push(current);
        if (chessboard[current][border1] || chessboard[current][border2]) {
          break;
        }
        current += direction;
      }
      current = queenPosition;
      allMoves[i].shift();
    }
    
    return allMoves;
  }
  
  // removes moves that are blocked by one friendly piece or 2 other pieces in a row
  private filterBlockedMoves(chessboard: Chessboard, allMoves: number[][], queenPosition: number, turn: Turn) {
    let newAllMoves:number[][] = [[],[],[],[]];

    for (let i = 0; i < allMoves.length; i++) {
      for (let j = 0; j < allMoves[i].length ; j++) {
        let move = allMoves[i][j];
        let move2 = allMoves[i][j+1]
        if (chessboard[move]["piece"] !== turn) {

          if (!chessboard[move]["piece"] || !chessboard[move2]?.["piece"]) {
            newAllMoves[i].push(allMoves[i][j])
          } else {
            break;
          }
        } else {
          break;
        }
      }
    }
    return newAllMoves
  }

  // removes oponents positions from queens moves
  private removeOponentsPosFromQueenMoves(moves: number[][], chessboard: Chessboard, turn: Turn) {
    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
        if (chessboard[moves[i][j]]['piece']) {
          moves[i] = moves[i].filter((move) => move !== moves[i][j]);
        }
      }
    }
    return moves;
  }
  
  // marking killable pieces and removes their positions 
  private getQueenKillMoves(moves: number[][], chessboard: Chessboard, queenPos: number, turn: Turn) {
    let kills: number[][] = [[], [], [], []]
    let opponent = turn == "white" ? "black" : "white"; 
    let objects = [];
    
    for (let i = 0; i < moves.length; i++) {
      let kill;
      for (let j = 0; j < moves[i].length; j++) {
        if (chessboard[moves[i][j]]['piece'] == opponent) {
          kills[i].push(moves[i][j]);
          kill = moves[i][j];
          if (kill && kill !== moves[i][j]) {
            objects.push({piece: moves[i][0], move: moves[i][j], kill: kill});
          }
        }
      }
    }
    return [kills, objects];
  }
  

  private setAvailableMoves(moves: Moves | null = null): void {
    if (moves) {
      this.availableMoves = moves;
    } else {
      this.availableMoves = [null];
    }
  }

  private move(
    fromId: number | null,
    targetId: number | null,
    chessboard: Chessboard
  ): Chessboard {
    if (fromId && targetId) {
      let temp = chessboard[fromId]["piece"];
      if (chessboard[fromId]["queen"]) {
        chessboard[fromId]['queen'] = false;
        chessboard[targetId]['queen'] = true;
      }
      
      chessboard[fromId]["piece"] = "";
      chessboard[targetId]["piece"] = temp;
    }
    return chessboard;
  }

  private kill(
    squareId: number,
    moves: Moves,
    killablePieces: Moves,
    chessboard: Chessboard,
    killingPiece: number,
  ) {
    let pieceToKill;
    if (chessboard[squareId]["queen"]) {
      let directions = [-9, - 7 , 9, 7];
      let diff = killingPiece - squareId;
      let direction;
      if (diff < 0) {
        if (diff % 9 == 0) {
          direction = 9;
        } else {
          direction = 7;
        }
      } else {
        if (diff % -7 == 0) {
          direction = -7
        } else {
          direction = -9
        }
      }
      for (let piece of killablePieces) {
        if (piece && diff % direction == 0) {
          if ( direction < 0 && piece > squareId) {
            pieceToKill = piece;
          } else if (direction > 0 && piece < squareId) {
            pieceToKill = piece;
          }
        }
        
      }


    } else {
      let moveIndex = moves.indexOf(squareId);
      pieceToKill = killablePieces[moveIndex];
    }
    

    if (pieceToKill) {
      chessboard[pieceToKill]["piece"] = "";
    }
    return chessboard;
  }

  private switchTurn(): void {
    this.turn = this.turn == "white" ? "black" : "white";
  }


  private getLongestRoute(moves: number[], turn: Turn, chessboard: Chessboard) {

    let deepPositions: IPosition[] = [];
    let stack: IPosition[] = [];

    console.log(moves);

    moves.forEach(move => {
      let board = JSON.parse(JSON.stringify(chessboard));
      let position: IPosition = {
        move: move,
        depth: 0,
        prev: null,
        board: board,
        visited: new Set(),
      }
      stack.push(position)
    })

      let current = stack[stack.length - 1];
      let counter = 0; // for optimization testing porpouse 
    while (current) {
      counter++;
      current.board[current.move]["piece"] = "";
      let [moves, killablePieces] = this.getPossibleMoves(
            current.move,
            current.board,
            turn
          );
          console.log(killablePieces)
          console.log('dd')
      let fMoves = this.filterOutMovesWithoutKill(moves, killablePieces);
      let filteredMoves = utility.filterOutNulls(fMoves);

      // pushing available moves to stack
      filteredMoves.forEach(move => {
        let newBoard = JSON.parse(JSON.stringify(current.board));
        newBoard = this.kill(move, moves, killablePieces, newBoard, current.move);
        if (!current.visited.has(move)) {
          let visit: Set<number> = new Set();
          let position = {
            move,
            depth: current.depth + 1,
            prev: current,
            board: newBoard,
            visited: visit,
          }
          stack.push(position);
        } 
      })
      

      // poping from stack when available moves from current pos are already visited
      if (utility.setIncludesArray(current.visited, filteredMoves)) {
        deepPositions.push(current);
        stack.pop();
        current = stack[stack.length - 1];
      } 

      // Proceding to stack's top or stopping loop when empty
      if (stack.length > 0) {
        current = stack[stack.length - 1];
      } else {
        break;
      }
      current.prev?.visited.add(current.move);
    }
    let deepest = this.findDeepestMoves(deepPositions);
    let routes = this.getFullRoutes(deepest);
    console.log(routes);
    return routes;
  }


  private findDeepestMoves(moves: IPosition[]): IPosition[] {
    if (moves.length == 0) {
      return [];
    }
    moves.sort((a, b) => b.depth - a.depth);
    let highest = moves[0].depth;
    let deepest = [];

    for (let move of moves) {
      if (move.depth >= highest) {
        deepest.push(move);
      } else {
        break;
      }
    }
    return deepest;
  }
  private getFullRoutes(deepestPositions: IPosition[]): number[][] {
    let routes: number[][] = [];
    deepestPositions.forEach((position) => {
      let route = [];
      let current: IPosition | null = position;
      while (current) {
        route.push(current.move);
        current = current.prev;
      }
      routes.push(route);
    })
    return routes
  }
}

