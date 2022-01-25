import { runInThisContext } from "vm";
import { SIDE } from "./config";
import * as utility from "./utility"; 

type Border = "border-top" | "border-left" | "border-right" | "border-bot";

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
  board: IChessboard,
  visited: Set<number>,
}
type Moves = Move[]
type Turn = "black" | "white";
export type IChessboard = ISquare[];

export type Move = {
    piece: number,
    move: number,
    kill: number | null,
}




export class Engine {
  chessboard: IChessboard;
  turn: Turn;
  selectedPiece: number | null;
  playerSide: string;
  availableMoves: number[];
  selectionLock: boolean;
  lockedPieces: number[];
  killablePieces: number[];
  winner: Turn | "";
  whiteSide: "top" | "bot";

  constructor(side: SIDE) {
    
    this.whiteSide = side == SIDE.NORMAL ? "bot" : "top";
    this.playerSide = this.whiteSide; // this is turn side. Player is always bot
    this.chessboard = [];
    this.turn = "white";
    this.selectedPiece = null;
    this.availableMoves = [];
    this.selectionLock = false;
    this.lockedPieces = [];
    this.killablePieces = [];
    this.winner = "";
  }

  
  setWinner(chessboard: IChessboard, turn: Turn, playerSide: string) {
    const allMoves = this.getAllMoves(chessboard, turn, playerSide);
    const opponent = turn == "white" ? "black" : "white";
    if (allMoves.length == 0) {
      this.winner = opponent;
      return opponent;
    }
  }

  public unselectPiece() {
      this.selectedPiece = null;
  }
  private selectPiece(id: number | null) {
      this.selectedPiece = id; 
  }
  private setAvailableMoves(moves: Moves) {
    let movesOnly = [];
    for (let move of moves) {
        movesOnly.push(move.move);
    }
    this.availableMoves = movesOnly;
  }
  private unsetAvailableMoves() {
      this.availableMoves = [];
  }
  private lockPieces(pieces: number[]) {
    this.lockedPieces = pieces;
  }
  private unlockPieces() {
    this.lockedPieces = [];
  }
  private getRoutesStarts(routes: number[][]) {
    let array = [];
    for (let i = 0; i < routes.length; i++) {
      array.push(routes[i][0])
    }
    return array;
  }


  /////////////////////////////// MAIN FUNCTION
  public performAction(
    clickedId: number | null,
    chessboard: IChessboard
  ): void {

    let killMoves = this.getAllMovesWithKill(chessboard, this.turn, this.playerSide);
    let routes = this.getLongestRoutes(killMoves, this.turn, chessboard, this.playerSide);
    if (routes.length > 0) {
      let startPieces = this.getRoutesStarts(routes);
      this.lockPieces(startPieces);
    } else {
      this.unlockPieces()
    }
    // Selecting
      if (clickedId && chessboard[clickedId]["piece"] == this.turn && this.selectedPiece !== clickedId) {
        
        if (this.lockedPieces.length == 0 || this.lockedPieces.includes(clickedId)) {
          this.selectPiece(clickedId);
        }
      } else if (!(clickedId && this.selectedPiece && this.availableMoves.includes(clickedId))) {
          this.unselectPiece();
          this.unsetAvailableMoves();
      }
    
    if (this.selectedPiece) {
        let moves = this.getMoves(this.selectedPiece, chessboard, this.turn, this.playerSide)
        if (this.lockedPieces.length > 0) {
          moves = moves.filter((move) => routes.some((route) => move.move == route[1]));
        }
        
        this.setAvailableMoves(moves);
    }

    // movement and killing
    if (clickedId && this.availableMoves.includes(clickedId) && this.selectedPiece) {
      let moves = this.getMoves(this.selectedPiece, chessboard, this.turn, this.playerSide)
      let move = this.getMove(clickedId, moves);
      if (move) {
        this.move(move.piece , clickedId, chessboard);
        this.unsetAvailableMoves();
        this.unselectPiece();
        this.lockPieces([]);
        let killed = false;
        if (move.kill) {
          this.kill(move.kill, chessboard);
          killed = true;
        }
        if (killed) {
          let routes = this.getLongestRoutes([move.move], this.turn, chessboard, this.playerSide);
          if (routes.some((route) => route.length > 1)) {
            this.lockPieces([move.move]);
            this.selectPiece(move.move);
            let moves = this.getMoves(move.move, chessboard, this.turn, this.playerSide);
            for (let route of routes) {
              this.availableMoves.push(route[1]);
            }
          } else {
            let shouldQueen = this.shouldMakeQueen(move.move, chessboard)
          if (shouldQueen) {
            this.makeQueen(move.move, chessboard);
          }
            
            this.switchTurn();
            
          }
        } else {
          let shouldQueen = this.shouldMakeQueen(move.move, chessboard)
          if (shouldQueen) {
            this.makeQueen(move.move, chessboard);
          }
          this.switchTurn();
        }
      }
    }
    this.setWinner(chessboard, this.turn, this.playerSide);
  }

  /////////////////////////////////////////////////


  shouldMakeQueen(piece: number, chessboard: IChessboard): boolean {
    if (this.playerSide == "bot") {
      if (chessboard[piece]["border-top"]) {
        return true;
      }
    } else {
      if (chessboard[piece]["border-bot"]) {
        return true;
      }
    }
    return false;
  }

  makeQueen(id: number, chessboard: IChessboard): void {
    chessboard[id]['queen'] = true;
  }


  switchTurn(): void {
    this.turn = this.turn == "white" ? "black" : "white";
    this.playerSide = this.playerSide == "bot" ? "top" : "bot";
  }

  kill(target: number, chessboard: IChessboard): IChessboard {
    chessboard[target]["piece"] = "";
    chessboard[target]["queen"] = false;
    return chessboard;
  }

  // picking Move object based on his move attribute
  getMove(id: number, moves: Moves): Move | null {
    for (let move of moves) {
      if (move.move == id) {
        return move;
      }
    }
    return null;
  }
  

  move(from: number, target: number, chessboard: IChessboard) {
    if (chessboard[from]["queen"]) {
      chessboard[from]["queen"] = false;
      chessboard[target]["queen"] = true;
    }
    chessboard[target]["piece"] = chessboard[from]["piece"];
    chessboard[from]["piece"] = "";
  }


  public getMoves(selected: number, chessboard: IChessboard, turn: Turn, playerSide: string): Moves {
    let moves: any = [];
    if (chessboard[selected]['queen']) {
        moves = this.getQueenMoves(selected, chessboard, turn);
    } else {
        moves = this.getRegularMoves(selected, chessboard, turn, playerSide);
    }
    return moves;
  }

  getQueenMoves(selected: number, chessboard: IChessboard, turn: Turn): Moves {
    let moves = this.getObliqueMoves(selected, chessboard);
    moves = this.filterBlockedMoves(chessboard, moves, selected, turn)
    let qMoves = this.getQueenFullMoves(moves, chessboard, selected, turn);

    return qMoves;

  }
  private getObliqueMoves(queenPosition: number, chessboard: IChessboard) {

    let allMoves: number[][] = [[],[],[],[]]; 
    let current = queenPosition;

    let borders: Border[] = ['border-left', 'border-top', 'border-right', 'border-bot', "border-left"];
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

  private filterBlockedMoves(chessboard: IChessboard, allMoves: number[][], queenPosition: number, turn: Turn) {
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

  private getQueenFullMoves(moves: number[][], chessboard: IChessboard, queenPos: number, turn: Turn): Moves {
    let opponent = turn == "white" ? "black" : "white"; 
    let qMoves = [];
    
    for (let i = 0; i < moves.length; i++) {
      let kill;
      for (let j = 0; j < moves[i].length; j++) {
        if (chessboard[moves[i][j]]['piece'] == opponent) {
          kill = moves[i][j];
        }
        if (kill !== moves[i][j]) {
            if (kill) {
                qMoves.push({piece: queenPos, move: moves[i][j], kill: kill});
              } else {
                  qMoves.push({piece: queenPos, move: moves[i][j], kill: null});
              }
        }
      }
    }
    return qMoves;
  }
  getRegularMoves(selected: number, chessboard: IChessboard, turn: Turn, playerSide: string): Moves {
    let directions = [-9, -7, 7, 9];
    let playerDirections;

    if (this.playerSide == "bot") {
      playerDirections = [-9, -7];
    } else {
      playerDirections = [9, 7];
    }

    if (chessboard[selected]["border-left"]) {
      directions = directions.filter((dir) => dir !== 7);
      directions = directions.filter((dir) => dir !== - 9);
    } else if (chessboard[selected]["border-right"]) {
      directions = directions.filter((dir) => dir !== - 7);
      directions = directions.filter((dir) => dir !== 9)
    }

    let moves = [];

    for (let dir of directions) {
      let moveBy1 = selected + dir;
      if (moveBy1 < 0 || moveBy1 > 63) {
        continue;
      }
      let piece = chessboard[moveBy1]["piece"];
      if (piece == turn) {
        continue;
      } else if (piece == "" && playerDirections.includes(dir)) {
        moves.push({piece: selected, kill: null, move: moveBy1})
      } else {
        let moveBy2 = moveBy1 + dir;
        if (moveBy2 < 0 || moveBy2 > 63) {
          continue;
        } else if (chessboard[moveBy2]["border-left"] && (dir == - 7 || dir ==  9)) {
          continue;
        } else if (chessboard[moveBy2]["border-right"] && (dir == - 9 || dir ==  7)) {
          continue;
        } else if (chessboard[moveBy2]["square"] !== 'black') {
          continue;
        } else if (chessboard[moveBy1]["piece"] && !chessboard[moveBy2]["piece"]) {
          moves.push({piece: selected, kill: moveBy1, move: moveBy2})
        }
      }
    }
    return moves;
  }

    


  public getAllMovesWithKill(chessboard: IChessboard, turn: Turn, playerSide: string): number[] {
    let killMoves = [];
    for (let i = 0; i < 64; i++) {
      if (chessboard[i]["piece"] && chessboard[i]["piece"] == turn) {
        let moves = this.getMoves(i, chessboard, turn, playerSide);
        for (let move of moves) {
          if (move.kill) {
            killMoves.push(move.piece);
          }
        }
      }
    }
    
    return killMoves;
  }
 
  public getLongestRoutes(moves: number[], turn: Turn, chessboard: IChessboard, playerSide: string) {

    let deepPositions: IPosition[] = [];
    let stack: IPosition[] = [];

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
      let temp = [];
      for (let d of stack) {
        temp.push(d);
      }
      counter++;
      if (counter > 20) {
        break;
      }
      current.board[current.move]["piece"] = "";
      let moves = this.getMoves(
            current.move,
            current.board,
            turn,
            playerSide
          );
      let movesWithKill = moves.filter((move) => move.kill !== null);
      
      // pushing available moves to stack
      movesWithKill.forEach(move => {
        let newBoard = JSON.parse(JSON.stringify(current.board));
        if (move.kill) {
          newBoard = this.kill(move.kill, newBoard);
        }
        if (!current.visited.has(move.move)) {
          let visit: Set<number> = new Set();
          let position = {
            move: move.move,
            depth: current.depth + 1,
            prev: current,
            board: newBoard,
            visited: visit,
          }
          stack.push(position);
        } 
      })

      let flatMoves = []
      for (let i = 0; i < movesWithKill.length; i++) {
        flatMoves.push(movesWithKill[i].move);
      }
      // poping from stack when available moves from current pos are already visited
      if (utility.setIncludesArray(current.visited, flatMoves)) {
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
    routes = this.remNestArrayDuplicates(routes);
    for (let route of routes) {
      route.reverse();
    }
    return routes;
  
}




  private remNestArrayDuplicates(array: number[][]) {
    let set = new Set();

    for (let i = 0; i < array.length; i++) {
      set.add(JSON.stringify(array[i]))
    }
    let arr: any = Array.from(set);
    let filtered = [];
    for (let elem of arr) {
      filtered.push(JSON.parse(elem));
    }
    return filtered;
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

filterMovesWithoutKill(moves: Moves): Moves {
  let filtered = moves.filter((move) => move.kill !== null);
  return filtered;
 }

 getAllMoves(chessboard: IChessboard, turn: Turn, playerSide: string): Moves {
   let allMoves = [];
  for (let i = 0; i < 64; i++) {
    if (chessboard[i]["piece"] == turn) {
      let moves = this.getMoves(i, chessboard, turn, playerSide);
      allMoves.push(...moves);
    }
  }
  return allMoves;
 }

}



