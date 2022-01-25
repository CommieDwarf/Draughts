import { Engine } from "./engine";
import { IChessboard } from "./engine";
import { Move } from "./engine";
import {sleep} from "./utility";

type Color = "black" | "white";
type Side = "top" | "bot";
type Combo = {
    route: number[], 
    playerScore: number,
    botScore: number,
    board: IChessboard,
    color: Color,
    scoreDiff: number,
    finish?: boolean,
    prev?: Combo,
    next?: Combo,
}

type simulatedMove = {
    move: Move,
    board: IChessboard,
    diff: number,
    prev: null | simulatedMove,
    prediction?: number,
}

export default class Bot {

    engine: Engine;

    scoreSheet: number[];
    color: Color;
    playerColor: Color;

    constructor(engine: Engine, color: Color) {
        this.engine = engine;
        this.color = color;
        this.playerColor = this.color == "white" ? "black" : "white";
        this.scoreSheet = getScoreSheet();
    }

    async makeMove(chessboard: IChessboard) {
        this.engine.playerSide = "top";
        let moves = this.findBestMoves(chessboard, this.color);
        let move = moves[Math.floor(Math.random() * moves.length)];
        if (move) {
            let shouldQueen = this.engine.shouldMakeQueen(move.move, chessboard)
            if (shouldQueen) {
                this.engine.makeQueen(move.move, chessboard);
            }
            this.engine.move(move.piece, move.move, chessboard);
            if (move.kill) {
                this.engine.kill(move.kill, chessboard);
                let routes = this.engine.getLongestRoutes([move.move], this.color, chessboard, "top");
                if (routes.some((route) => route.length > 1)) {
                    await sleep(1000);
                    this.makeMove(chessboard);
                } else {
                    this.engine.turn = this.playerColor;
                }
            } else {
                this.engine.turn = this.playerColor;
            }

        }
        this.engine.playerSide = "bot";
    }

    findBestMoves(chessboard: IChessboard, color: Color) {
        let engine = this.engine
        let opponentColor: Color = color == "white" ? "black" : "white";

        // When bot has kill he figuers up which killing combo is the best
        let board = JSON.parse(JSON.stringify(chessboard));
        let combos = this.doComboSequence(board, color, "top");
        if (combos.length > 0) {
            return this.getMovesFromCombos(combos, board, color);
        }

        // When bot needs to make normal move he simulates each every possible move nad checking
        // consequences
        board = JSON.parse(JSON.stringify(chessboard));
        let possibleMoves = engine.getAllMoves(board, color, "top");
        let simulatedMoves = this.simulateMove(possibleMoves, board, color, "top");
        let bestMoves = this.getBestMoves(simulatedMoves);
        let moves = bestMoves.map((move) => move.move);
        return moves;
    }

    // returns moves that have highest .prediction attribute that is above 1. If none of them have .prediction
    // above 1 it picks move with highest .diff (botScore - playerScore).
    getBestMoves(simulatedMoves: simulatedMove[]) {
        let bestScore = Number.NEGATIVE_INFINITY;
        let bestMoves: simulatedMove[] = [];
        for (let move of simulatedMoves) {
            let score;
            if (move.prediction) {
                score = move.prediction
            } else {
                score = move.diff;
            }
           if (score > bestScore) {
               bestScore = score;
               bestMoves = [move]
           } else if (score == bestScore) {
               bestMoves.push(move);
           }
        }
       
        return bestMoves;
    }

    getMovesFromCombos(combos: Combo[], chessboard: IChessboard, color: Color) {
        let finishCombos = combos.filter((combo) => combo.finish == true);
            let bestCombos = this.getBestCombos(finishCombos);
            let originalRoutes = this.getOriginalRoutesFromCombos(bestCombos);
            let moves = this.getFirstMovesFromRoutes(originalRoutes, chessboard, color, "top");
            return moves;
    }


    
    simulateMove(moves: Move[], chessboard: IChessboard, color: Color, side: Side) {

        let opponentSide: Side = side == "top" ? "bot" : "top";
        let opponentColor: Color = color == "white" ? "black" : "white";
        let simulatedMoves = [];
        for (let move of moves) {
            let board: IChessboard = JSON.parse(JSON.stringify(chessboard));
            this.engine.move(move.piece, move.move, board);
            let playerScore = this.getScore(board, this.playerColor, 'bot');
            let botScore = this.getScore(board, this.color, 'top');
            let diff = botScore - playerScore;
            let pushed: simulatedMove = {move: move, board: board, diff: diff, prev: null}
            simulatedMoves.push(pushed);

            

            // PLAYER MOVES
            let combos = this.doComboSequence(board, opponentColor, opponentSide);
            if (combos.length > 0) {
                
                let worstCombos = this.getWorstCombos(combos);
                pushed.prediction = worstCombos[0].scoreDiff;
            }

        }
        return simulatedMoves;
    }

    getFirstMovesFromRoutes(routes: number[][], chessboard: IChessboard, turn: Color, side: Side) {
        let firstMoves = [];
        for (let route of routes) {
            let piece = route[0];
            let moveId = route[1];
            let moves = this.engine.getMoves(piece, chessboard, turn, side);
            let move = this.engine.getMove(moveId, moves);
            firstMoves.push(move);
        }
        return firstMoves;
    }

    getOriginalRoutesFromCombos(combos: Combo[]) {
        let routes = [];
        for (let combo of combos) {
            let current = combo;
                while (true) {
                    if (!current.prev) {
                        routes.push(current.route);
                        break;
                    } else {
                        current = current.prev;
                    }
                }
        }
        return routes;
    }

    getBestCombos(combos: Combo[]) {
        let best: Combo[] = [];
        let highestDiff = Number.NEGATIVE_INFINITY;
        for (let combo of combos) {
            if (combo.scoreDiff > highestDiff) {
                highestDiff = combo.scoreDiff;
                best = [combo];
            } else if (combo.scoreDiff == highestDiff) {
                best.push(combo);
            }
        }
        return best;
    }
    getWorstCombos(combos: Combo[]) {
        let worst: Combo[] = [];
        let lowestDiff = Infinity;

        let lastCombos = this.getLastCombos(combos);
        
        for (let combo of lastCombos) {
            if (combo.scoreDiff < lowestDiff) {
                if (combo.next) 
                lowestDiff = combo.scoreDiff;
                worst = [combo];
            } else if (combo.scoreDiff == lowestDiff) {
                worst.push(combo);
            }
        }
        return worst;
    }

    getLastCombos(combos: Combo[]) {
        let lastCombos = combos.map((combo) => {
            let current = combo;
            let counter = 0;
            while (current.next) {
                counter ++;
                if (counter > 20) {
                    break;
                }
                if (current.next) {
                    current = current.next
                }
            }
            return current;
        })
        return lastCombos;
    }

    doComboSequence(chessboard: IChessboard, color: Color, side: Side ) {

        let opponentColor: Color = color == "white" ? "black" : "white";

        let allCombos: Combo[] = []

        let board = JSON.parse(JSON.stringify(chessboard));
        let combos = this.doCombo(board, color, side, color);
        allCombos = allCombos.concat(combos); 
            combos.forEach((combo) => {
                let board = combo.board;
                board = JSON.parse(JSON.stringify(board));
                let combos2 = this.doCombo(board, opponentColor, side, opponentColor);
                if (combos2.length == 0) {
                    combo.finish = true;
                }
                allCombos = allCombos.concat(combos2);
                combos2.forEach((combo2) => {
                    combo.next = combo2;
                    combo2.prev = combo;
                    let board = combo2.board;
                    board = JSON.parse(JSON.stringify(board))
                    let combos3 = this.doCombo(board, color, side, color);
                    if (combos3.length == 0) {
                        combo2.finish = true;
                    }
                    combos3.forEach((combo3) => {
                        combo3.prev = combo2; 
                        combo2.next = combo3;
                        combo3.finish = true});
                    allCombos = allCombos.concat(combos3);
            })
        })

    return allCombos;
}


    doCombo(chessboard: IChessboard, turn: Color, side: Side, color: Color) {
        let engine = this.engine;
        let board = JSON.parse(JSON.stringify(chessboard));
        let killMoves = engine.getAllMovesWithKill(board, turn, side);
        let combos: Combo[] = [];
        let routes = engine.getLongestRoutes(killMoves, turn, board, side);
        let boards: IChessboard[] = [];
        for (let i = 0; i < routes.length; i++) {
            board = JSON.parse(JSON.stringify(chessboard));
            boards.push(this.moveAlongRoute(routes[i], board, side, color));
            let botScore = this.getScore(boards[i], this.color, "top");
            let playerScore = this.getScore(boards[i], this.playerColor, "bot");
            combos.push({
                route: routes[i],
                playerScore: playerScore,
                botScore: botScore,
                board: boards[i],
                color: turn,
                scoreDiff: botScore - playerScore,
                finish: false,
            })
        }
        return combos;
    }

    moveAlongRoute(route: number[], chessboard: IChessboard, side: "top" | "bot", color: Color) {
        let engine = this.engine
        let current = route[0];
        let routeCopy = route.slice(0);
        while (routeCopy.length > 1) {
            let next = routeCopy[1];
            let moves = engine.getMoves(current, chessboard, color, side);
            let move = engine.getMove(next, moves);

            if (move) {
                engine.move(current, move.move, chessboard);
                if (move.kill) {
                    chessboard = engine.kill(move.kill, chessboard);
                }
            }
            routeCopy.shift();
            current = routeCopy[0];
        }
        return chessboard;
    }

    getScore(chessboard: IChessboard, color: Color, side: "top" | "bot") {
        let scoresheet = this.scoreSheet.slice(0);
        scoresheet = side == "top" ? this.scoreSheet : scoresheet.reverse();

        let sum = 0;
        for (let i = 0; i < scoresheet.length; i++) {
            if (chessboard[i]["queen"] && chessboard[i]["piece"] == color) {
                sum += 25;
            } else if (chessboard[i]["piece"] == color) {
                sum += scoresheet[i];
            }
        }
        return sum;
    }
}

function getScoreSheet() {
    let scoreSheet = [10,  10,  10,  10,  10,  10,  10,  10,
                      11,  12,  12,  12,  12,  12,  12,  11,
                      13,  14,  14,  14,  14,  14,  14,  13,
                      15,  16,  16,  16,  16,  16,  16,  15,
                      17,  18,  18,  18,  18,  18,  18,  17,
                      18,  19,  19,  19,  19,  19,  19,  18,
                      20,  21,  21,  21,  21,  21,  21,  20, 
                      24,  25,  25,  25,  25,  25,  25,  24] 
    return scoreSheet;
}

