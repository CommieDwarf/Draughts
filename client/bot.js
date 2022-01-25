"use strict";
const blackPiece = "<div class=\"piece piece-black\"> <div class=\'piece-center piece-center-black\'> </div> </div>";
const whitePiece = "<div class=\"piece piece-white\"> <div class=\'piece-center piece-center-white\'> </div> </div>";
const whiteQueen = `<div class=\"piece piece-white\">
  <div class=\'piece-center piece-center-white\'>
  <div class=\"pionowa-lewa\">
  </div>
  <div class=\"pionowa-srodkowa\">
  </div>
  <div class=\"pionowa-prawa\">
  </div>
  <div class=\"pozioma-belka\">
  <div class=\"cien-kula1 cien-white cien-kula\">
  </div>
  <div class=\"cien-kula2 cien-white cien-kula\">
  </div>
  <div class=\"cien-kula3 cien-white cien-kula\">
  </div>
  </div>
  <div class=\"cien1 cien-white cien\">
  </div>
  <div class=\"cien2 cien-white cien\">
  </div>
  <div class=\"cien3 cien-white cien\">
  </div>
  </div>`
const blackQueen = `<div class="piece piece-black">
  <div class='piece-center piece-center-black'>
  <div class="pionowa-lewa black-crown pionowa-lewa-czarna">
  </div>
  <div class="pionowa-srodkowa black-crown pionowa-srodkowa-czarna">
  </div>
  <div class="pionowa-prawa black-crown pionowa-prawa-czarna">
  </div>
  <div class="pozioma-belka black-crown pozioma-belka-czarna">
  <div class="cien-kula1 cien-black cien-kula">
  </div>
  <div class="cien-kula2 cien-black cien-kula">
  </div>
  <div class="cien-kula3 cien-black cien-kula">
  </div>
  </div>
  <div class="cien1 cien-black cien">
  </div>
  <div class="cien2 cien-black cien">
  </div>
  <div class="cien3 cien-black cien">
  </div>
  </div>
  </div>`

let whiteWin = '<h1 id="h1-win"><span class="black-letter">W</span><span class="hi">hi</span><span class="black-letter te" >te</span> W<span class="black-letter">in</span>s!</h1>';
let blackWin = '<h1 id="h1-win"><span class="black-letter">B</span><span class="la">la</span><span class="black-letter ck">ck</span> W<span class="black-letter in">in</span><span class="s">s!</span></h1>';


let selectedNumSquare;

let globalSemanticChessboard = [];
let globalTurn = "white";
let globalMoves;
let comboSquare;
let routes = [];
let shortRoutes = [];
let level = 0;
let levelArray = []
let prevMoves = [];
let prevArray = [];
let newGameCounter = 0;
let playerBlock;
let turn = 0;



startNewGame()

function startNewGame() {
  unhighlightAllMoves();
  unhighlightAllPieces();
  unhighlightAllYellowPieces()
  clearChessboard()
  selectedNumSquare = "";
  globalSemanticChessboard = [];
  globalTurn = "white";
  globalMoves = "";
  comboSquare = "";
  routes = [];
  shortRoutes = [];
  level = 0;
  levelArray = []
  prevMoves = [];
  prevArray = []
  turn = 0;

  createSemanticChessboard(globalSemanticChessboard);
  addPieces(globalSemanticChessboard);
  if (newGameCounter == 0) {
      addOnClickToChessboard(globalSemanticChessboard);
      addOnHover();
  }
  document.getElementById("win-title").setAttribute("style", "display: none")
  document.getElementById("play-again").setAttribute("style", "display: none")
  newGameCounter++;
}

function clearChessboard() {
  for (let i = 0; i < globalSemanticChessboard.length; i++) {
    document.getElementById(i).innerHTML = "";
  }
}

function addOnHover() {
  let chessboard = document.getElementById('chessboard');



  chessboard.addEventListener("mouseover", function(e) {
    let selectablePieces = determineForcedMoves(routes, 0)[0];
    if (e.target.closest('.piece-white') && !e.target.closest(".piece-white").classList.contains("selectedWhitePiece")) {
      if (!playerBlock && selectablePieces.length == 0 || selectablePieces.includes(e.target.closest(".square").id)) {
        e.target.closest('.piece-white').classList.add("piece-white-hover");
        if (e.target.closest(".piece-center-white")) {
          e.target.closest(".piece-center-white").classList.add('piece-center-white-hover');
        } else {
          e.target.firstElementChild.classList.add('piece-center-white-hover');
        }
      }


    }
  })
  chessboard.addEventListener("mouseout", function(e) {
    if (e.target.closest('.piece-white')) {
      e.target.closest('.piece-white').classList.remove("piece-white-hover");
      if (e.target.closest(".piece-center-white")) {
        e.target.closest(".piece-center-white").classList.remove('piece-center-white-hover');
      } else {
        e.target.firstElementChild.classList.remove('piece-center-white-hover');
      }
    }
  })
}




function addOnClickToChessboard(semanticChessboard) {

  let chessboard = document.getElementById("chessboard");

  let allMoves
  let moves
  let killMoves
  let killMove
  let comboFlag;

  chessboard.addEventListener("click", function(event) {
    let squareId = globalSemanticChessboard[event.target.closest(".square").getAttribute('id')]? event.target.closest(".square").getAttribute('id') : '';
    squareId = parseInt(squareId);

    let forcedKillFlag
    routes.length > 0 ? forcedKillFlag = true : forcedKillFlag = false;
    let selectablePieces = determineForcedMoves(routes, squareId)[0]; // IN CASE OF FORCED KILLS
    let selSquareRoutes = determineForcedMoves(routes, squareId)[1]; // FORCED ROUTE OF SELECTED SQUARE


    let win

    if (selectedNumSquare == squareId &&!comboFlag && !forcedKillFlag && !playerBlock) {
      selectedNumSquare = "";
      unhighlightAllMoves();
      unhighlightAllPieces();
      unhighlightAllYellowPieces()

      /////////////////////------------ZAZNACZANIE-------------------------------------------------------------------------------------------------------------------------------------
    } else if (globalSemanticChessboard[squareId]["piece"] == "white" && !comboFlag && (!forcedKillFlag || selectablePieces.includes(squareId)) && !playerBlock) {
      selectedNumSquare = squareId;

      unhighlightAllMoves();
      unhighlightAllPieces();
      unhighlightAllYellowPieces()

      highlightSelectedPiece(selectedNumSquare, globalSemanticChessboard, globalTurn)

      allMoves = estimateMoves(selectedNumSquare, globalTurn, globalSemanticChessboard)
      moves = allMoves[0];
      killMoves = allMoves[1];
      if(forcedKillFlag) {
        moves = cutOffMovesWhenNoKill(selectedNumSquare, moves, killMoves, globalSemanticChessboard, globalTurn)
      }
      highlightMoves(moves);
      highlightPiecesToKill(killMoves, globalTurn);

      if (turn == 4) {
        let delay = 10000;

        let timeout = setTimeout(pokazPapaja, delay)

        function pokazPapaja() {
          generujPapaja();
          if (delay > 500) {
            delay -= 500
          }
          setTimeout(pokazPapaja, delay);
        }
      }

    } else if (!event.target.closest(".square") && !comboFlag && !forcedKillFlag && !playerBlock) {
      selectedNumSquare = "";
      unhighlightAllMoves();
      unhighlightAllPieces();
      unhighlightAllYellowPieces()
      //////////-------------------------RUCH-----------------------------------------------------------------------------------------------------------------------------------
    } else if (selectedNumSquare && moves && moves.includes(squareId) && (!selSquareRoutes.some(arg=> Number.isInteger(arg)) || selSquareRoutes.includes(squareId)) && !playerBlock) {
      turn ++;
      let comboMoves
      killMove = returnKillMove(selectedNumSquare, squareId, killMoves)
      makeMove(squareId, killMove, globalTurn, globalSemanticChessboard, selectedNumSquare);
      moves = "";
      selectedNumSquare = "";

      unhighlightAllMoves();
      unhighlightAllPieces();
      unhighlightAllYellowPieces()

      killMove ? comboMoves = checkIfThereIsCombo(squareId, globalTurn, globalSemanticChessboard) : "";

      if (comboMoves) {
        selectedNumSquare = squareId;
        allMoves = estimateMoves(selectedNumSquare, globalTurn, globalSemanticChessboard)
        moves = allMoves[0];
        killMoves = allMoves[1];

        moves = cutOffMovesWhenNoKill(selectedNumSquare, moves, killMoves, globalSemanticChessboard, globalTurn)
        highlightSelectedPiece(selectedNumSquare, globalSemanticChessboard, globalTurn)
        highlightMoves(moves);
        comboFlag = true;


      } else {

        if ((globalSemanticChessboard[squareId]["border-top"] && globalTurn == "white") || (globalSemanticChessboard[squareId]["border-bot"] && globalTurn == "black")) {
          makeQueen(squareId, globalTurn);
        }

        globalTurn == "white" ? globalTurn = "black" : globalTurn = "white";
        comboFlag = false;

        win = checkWin(globalSemanticChessboard);
        if(win) {
          displayWinTitle(win);
          resetVariables()
        }

        if (!win) {
          playerBlock = true;
          setTimeout(() => {
            aiMakeMove(globalSemanticChessboard, globalTurn)
          }, 1000)
        }

      }

      ///////------------------------------------------------------------------------------------------------------------------------------------------
    } else if (globalSemanticChessboard[squareId]["piece"] != globalTurn && !comboFlag && !forcedKillFlag && !playerBlock) {
      selectedNumSquare = "";
      unhighlightAllMoves();
      unhighlightAllPieces();
      unhighlightAllYellowPieces()
    }

    let forcedRoutes = [];
    for (let route of routes) {
      if (route[0] == squareId) {
        forcedRoutes.push(squareId)
      }
    }



  }
)
}

function resetVariables() {
  allMoves = "";
  moves = "";
  killMoves = "";
  killMove = "";
  comboFlag = "";
}





function determineForcedMoves(routes, squareId) {
  let selectablePieces = [];
  let selSquareRoutes = [];
  if (routes.length > 0) {
    for (let i = 0; i < routes.length; i++) {
      selectablePieces.push(routes[i][0]);
      highlightSelectedPiece(routes[i][0], globalSemanticChessboard, globalTurn, true);
    }

    for (let i = 0; i < routes.length; i++) {
      for (let j = 0; j < routes[i].length; j++) {
        if (routes[i][j] == squareId) {
          selSquareRoutes.push(routes[i])
        }
      }
    }
    selSquareRoutes = selSquareRoutes.flat()
  }
  return [selectablePieces, selSquareRoutes];
}


// ====================================================================AI====================================================       AI


function aiMakeMove(semanticChessboard, turn) {
  if (turn == "white") {
    return;
  }


  checkAllPiecesForForcedKill(globalSemanticChessboard, globalTurn) // wrzuca do routes mozliwe sciezki bicia

  let allBlackPieces = returnAllPieces("black", semanticChessboard)
  let allWhitePieces = returnAllPieces("white", semanticChessboard)
  let blackMoves = returnAllMoves(allBlackPieces, semanticChessboard);

  blackMoves = deleteEmptyStrings(blackMoves)

  let random
  let piece
  let move
  let allMoves
  let moves
  let killMoves
  let killMove
  if (routes.length > 0) {  // COMBO
    let randomNum = Math.floor(Math.random() * routes.length);
    let route = routes[randomNum];

    aiDoCombo(route, semanticChessboard, turn)

    move = route[route.length - 1]



  } else {       // NORMALNY RUCH

    let bestMoves = aiFindBestMove(blackMoves, semanticChessboard)

    let piece;
    let move;
    if (bestMoves.length < 1) {
      let pieceNum = Math.floor(Math.random() * blackMoves.length)
      let moveNum = Math.ceil(Math.random() * (blackMoves[pieceNum].length -1));

      piece = blackMoves[pieceNum][0];
      move = blackMoves[pieceNum][moveNum]
    } else {
      let randomMove = bestMoves[Math.floor(Math.random() * bestMoves.length)]
      piece = randomMove.piece;
      move = randomMove.move;
    }

    let allMoves = estimateMoves(piece, turn, semanticChessboard)
    let killMoves = allMoves[1];
    let killMove = returnKillMove (piece, move, killMoves)

    makeMove(move, killMove, turn, semanticChessboard, piece);

    globalTurn = "white";
    playerBlock = false;

    checkAllPiecesForForcedKill(semanticChessboard, globalTurn);

    if (semanticChessboard[move]["border-bot"]) {
      makeQueen(move, turn);
    }

    win = checkWin(globalSemanticChessboard);
    if(win) {
      displayWinTitle(win);
      resetVariables()
    }

  }



}


function aiFindBestMove(aiMoves, semanticChessboard) {

  let botMoves = {
    bot: true,
    moves: [[]],
    counter: 0,
  }
  let playerMoves = {
    player: true,
    moves: [[]],
    counter: 0,
  }
  let turn = "black";
  for (let i = 0; i < aiMoves.length; i++) {
    let piece = aiMoves[i][0];
    for (let j = 1; j < aiMoves[i].length; j++) {
      let chessboard = JSON.parse(JSON.stringify(semanticChessboard))
      let blackStrategyValueBefore = estimateStrategicValue("black", chessboard)
      let whiteStrategyValueBefore = estimateStrategicValue("white", chessboard)

      let allMoves = estimateMoves(aiMoves[i][0], turn, semanticChessboard)
      let killMoves = allMoves[1];
      let killMove = returnKillMove (aiMoves[i][0], aiMoves[i][j], killMoves)

      simulateMove(aiMoves[i][j], killMove,  turn, chessboard, piece)

      let blackStrategyValueAfter = estimateStrategicValue("black", chessboard)
      let whiteStrategyValueAfter = estimateStrategicValue("white", chessboard)

      let blackPoints = blackStrategyValueAfter - blackStrategyValueBefore;
      let whitePoints = whiteStrategyValueAfter - whiteStrategyValueBefore;

      let moveInfo = {
        piece: piece,
        move: aiMoves[i][j],
        blackValOrigin: blackStrategyValueBefore,
        blackValAfter: blackStrategyValueAfter,
        whiteValOrigin: whiteStrategyValueBefore,
        whiteValAfter: whiteStrategyValueAfter,
        blackPoints : blackStrategyValueAfter - blackStrategyValueBefore,
        whitePoints: whiteStrategyValueAfter - whiteStrategyValueBefore,
        chessboard: chessboard,
        blackWhiteDiff: blackPoints - whitePoints,
        nextMoves: [],
        forceDiff: [],
      }
      botMoves.moves[0].push(moveInfo);
    }
  }
  simulateSkirmish(botMoves, playerMoves, turn)
  markOriginMoves(botMoves.moves)
  markOriginMoves(playerMoves.moves)

  let mergeMoves = {
    moves: [...botMoves.moves, ...playerMoves.moves]
  }
  addNextMoves(mergeMoves.moves);

  let lastMoves = filterLastMoves(mergeMoves.moves);
  addForceDiffs(lastMoves);
  lastMoves.sort((a, b) => a.origin.forceAverage < b.origin.forceAverage ? 1 : -1);
  let bestMoves = pickBestMoves(lastMoves);
  return bestMoves;
}



function simulateSkirmish(moves, opponentMoves, turn) {
  turn == "white" ? turn = "black" : turn = "white";
  let tempMoves = []
  if(moves.moves[moves.counter].length == 0) {
    return
  }

  for (let i = 0; i < moves.moves[moves.counter].length; i++) {
    let chessboard = moves.moves[moves.counter][i]["chessboard"];
    checkAllPiecesForForcedKill(chessboard, turn);
    let sRoutes = shortRoutes;
    if (sRoutes.length > 0) {
      for (let j = 0; j < sRoutes.length; j++) {
        chessboard = moves.moves[moves.counter][i]["chessboard"];
        for (let k = 0; k < sRoutes[j].length - 1; k++) {
            let piece = sRoutes[j][k];
            let move = sRoutes[j][k+1];

            let allMoves = estimateMoves(piece, turn, chessboard);
            let killMoves = allMoves[1];
            let killMove = returnKillMove(piece, move, killMoves);


            simulateMove(move, killMove, turn, chessboard, piece);

        }

        let blackStrategyValue = estimateStrategicValue("black", chessboard)
        let whiteStrategyValue = estimateStrategicValue("white", chessboard)

        chessboard = JSON.parse(JSON.stringify(chessboard));

        let moveInfo = {
          piece: sRoutes[j][0],
          finishMove: sRoutes[j][sRoutes[j].length -1],
          blackValAfter: blackStrategyValue,
          whiteValAfter: whiteStrategyValue,
          chessboard: chessboard,
          prevMove: moves.moves[moves.counter][i],
          nextMoves: [],
          forceDiff: [],
        }

        tempMoves.push(moveInfo);
      }
    }
    opponentMoves.moves[opponentMoves.counter] = tempMoves;
  }
  moves.counter ++;
  simulateSkirmish(opponentMoves, moves, turn)
}



function pickBestMoves(moves) {
  let bestMoves = [moves[0].origin]
  for (let i = 1; i < moves.length; i++) {
    if (moves[i].forceAverage == bestMoves[0].origin) {
      bestMoves.push(moves[i])
    }
  }
  return bestMoves;
}



function addForceDiffs(moves) {
  for (let i = 0; i < moves.length; i++) {
    let blackValOrigin = moves[i].origin.blackValOrigin;
    let whiteValOrigin = moves[i].origin.whiteValOrigin;
    let originForceBalance = blackValOrigin - whiteValOrigin;

    let blackValAFter = moves[i].blackValAfter;
    let whiteValAfter = moves[i].whiteValAfter;
    let afterForceBalance = blackValAFter - whiteValAfter;

    let forceDiff = afterForceBalance - originForceBalance;

    moves[i].origin.forceDiff.push(forceDiff);
  }
  for (let i = 0; i < moves.length; i++) {
    let forceSum = moves[i].origin.forceDiff.reduce((a, b) => a + b);
    let forceAverage = forceSum / moves[i].origin.forceDiff.length;
    moves[i].origin.forceAverage = forceAverage
  }
}




function filterLastMoves(moves) {
  let lastMoves = [];
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (moves[i][j].nextMoves.length == 0) {
        lastMoves.push(moves[i][j])
      }
    }
  }
  return lastMoves;
}



function addNextMoves(moves) {
  for (let i = 0; i < moves.length; i++) {
    for (let j = 0; j < moves[i].length; j++) {
      if (moves[i][j].prevMove) {
        moves[i][j].prevMove.nextMoves.push(moves[i][j])
      }
    }
  }
}






function markOriginMoves(movesArr) {
  for (let i = 0; i < movesArr.length; i++) {
    for (let j = 0; j < movesArr[i].length; j++) {
      let originObj = findOriginMove(movesArr[i][j]);
      movesArr[i][j].origin = originObj;
    }
  }
}

function findOriginMove(moveObj) {
  if (!moveObj["prevMove"]) {
    return moveObj
  }
  return findOriginMove(moveObj["prevMove"]);
}


function simulateMove(move, killMove, turn, semanticChessboard, selectedSquare) {

  //console.log("MOVING FROM: " + selectedSquare);
  //console.log("MOVING TO: " + move);
  //console.log("KILLING: " + killMove);

  if (semanticChessboard[selectedSquare]["queen"]) {
    semanticChessboard[move]["piece"] = turn;
    semanticChessboard[move]["queen"] = true;

    semanticChessboard[selectedSquare]["piece"] = "";
    semanticChessboard[selectedSquare]["queen"] = false;
  } else {
    semanticChessboard[move]["piece"] = turn;

    semanticChessboard[selectedSquare]["piece"] = "";
  }

  if (killMove) {
    semanticChessboard[killMove]["piece"] = "";
    semanticChessboard[killMove]["queen"] = false;
  }

}

// ____________________________________BOT_CONFIG

function estimateStrategicValue(side, semanticChessboard) {

  let sumPoints = 0;
  const lane1 = [1, 3, 5, 7];
  const lane2 = [8, 10, 12, 14];
  const lane3 = [17, 19, 21, 23];
  const lane4 = [24, 26, 28, 30];
  const lane5 = [33, 35, 37, 39];
  const lane6 = [40, 42, 44, 46];
  const lane7 = [49, 51, 53, 55];
  const lane8 = [56, 58, 60, 62];

  let queenPoints = 15;
  let basic = 20;
  let lanePoints = [4, 5, 6, 8, 10, 12, 14, 17]



  if (side == "white") {
    // 1   2   3   4   5  6  7  8
    lanePoints.reverse();
  }

  for (let i = 0; i < semanticChessboard.length; i++) {
    let piece = semanticChessboard[i]


    if (piece["piece"] == side) {
      sumPoints += basic;
    }

    if (piece["piece"] == side && piece["queen"]) {
      sumPoints += queenPoints;
    } else if (piece["piece"] == side){
      lane1.includes(i) ? sumPoints += lanePoints[0] : "";
      lane2.includes(i) ? sumPoints += lanePoints[1] : "";
      lane3.includes(i) ? sumPoints += lanePoints[2] : "";
      lane4.includes(i) ? sumPoints += lanePoints[3] : "";
      lane5.includes(i) ? sumPoints += lanePoints[4] : "";
      lane6.includes(i) ? sumPoints += lanePoints[5] : "";
      lane7.includes(i) ? sumPoints += lanePoints[6] : "";
      lane8.includes(i) ? sumPoints += lanePoints[7] : "";
    }
  }
  return sumPoints;
}



function aiDoCombo(route, semanticChessboard, turn) {

    let piece = route[0];
    let move = route[1];
    let allMoves = estimateMoves(piece, globalTurn, semanticChessboard);
    let killMoves = allMoves[1];
    let killMove = returnKillMove(piece, move, killMoves);
    setTimeout(() => {

      makeMove(move, killMove, turn, globalSemanticChessboard, piece)
      route.shift()

      if (route.length == 1) {
        playerBlock = false;
        globalTurn = "white";
        checkAllPiecesForForcedKill(globalSemanticChessboard, globalTurn)
        highlightForcedPieces();


        if (semanticChessboard[move]["border-bot"]) {
          makeQueen(move, turn);
        }
        win = checkWin(globalSemanticChessboard);
        if(win) {
          displayWinTitle(win);
          resetVariables()
        }

        return;
      }

      aiDoCombo(route, semanticChessboard, turn);

    }, 1000);
}


// =========================================================================================================================


function returnAllPieces(side, semanticChessboard) {
  let pieces = [];
  for (let i = 0; i < semanticChessboard.length; i++) {
    if (semanticChessboard[i]["piece"] == side) {
      pieces.push(i)
    }
  }
  return pieces;
}

function returnAllMoves(pieces, semanticChessboard) {

  let moves = [];
  for (let i = 0; i < pieces.length; i++) {
    let allMoves = estimateMoves(pieces[i], globalTurn, semanticChessboard)
    let tempMoves = allMoves[0];
    tempMoves.unshift(pieces[i])
    moves.push(tempMoves);
  }
  let possibleMoves = []
  for (let i = 0; i < moves.length; i++) {
    if (!moves[i][1] && moves[i][2]) {
      moves[i].splice(1, 1)
    }
    if (moves[i][1]) {
      possibleMoves.push(moves[i])
    }
  }
  return possibleMoves;
}


function chooseRandomMove(moves) {
  let piece = Math.floor(Math.random() * moves.length);
  let move = Math.ceil(Math.random() * (moves[piece].length -1));

  return [moves[piece], moves[piece][move]]
}

function deleteEmptyStrings(arrays) {
  let filteredArrays = []
  for (let i = 0; i < arrays.length; i++) {
    let tempArray = []
    for (let j = 0; j < arrays[i].length; j++) {
      if (arrays[i][j]) {
        tempArray.push(arrays[i][j])
      }
    }
    filteredArrays.push(tempArray)
  }
  return filteredArrays;
}





function checkWin(semanticChessboard) {
  let whitePieces = []
  let blackPieces = []

  for (let i = 0; i < semanticChessboard.length; i++) {
    let square = semanticChessboard[i]
    if (square["piece"] == "white") {
      whitePieces.push(i)
    } else if (square["piece"] == "black") {
      blackPieces.push(i)
    }
  }
  let whiteMovesCount = checkHowManyMovesPiecesHave(whitePieces);
  let blackMovesCount = checkHowManyMovesPiecesHave(blackPieces);


  if (whiteMovesCount == 0) {
    return "black";
  } else if (blackMovesCount == 0) {
    return "white";
  } else {
    return false;
  }
}


function checkHowManyMovesPiecesHave(pieces) {
  let possibleMoves = [];
  for (let piece of pieces) {
    let allMoves = estimateMoves(piece, globalTurn, globalSemanticChessboard)
    let moves = allMoves[0];
    if (moves.some(move => Number.isInteger(move))) {
      possibleMoves.push(moves);
    }
  }
  let moveCount = possibleMoves.length;
  return moveCount;
}




function checkAllPiecesForForcedKill(semanticChessboard, turn) {
  let piecesWithKill = [];
  let allBlackSquares = [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23, 24, 26, 28, 30, 33, 35, 37, 39, 40, 42, 44, 46, 49, 51, 53, 55, 56, 58, 60, 62]

  for(let i = 0; i < allBlackSquares.length; i++) {
    let j = allBlackSquares[i];
    if(semanticChessboard[j]["piece"] && semanticChessboard[j]["piece"] == turn) {
      let allMoves = estimateMoves(j, turn, semanticChessboard);
      if (allMoves[1].some(move => Number.isInteger(move))) {
        piecesWithKill.push(j)
      }
    }
  }

  let chessboard = {};


  let prevMove = []
  routes = []

  for (let i = 0; i < piecesWithKill.length; i++) {
    let queen = false;
    chessboard = JSON.parse(JSON.stringify(semanticChessboard))
    if (semanticChessboard[piecesWithKill[i]]["queen"]) {
      queen = true;
    }
    calculateComboRoute(piecesWithKill[i], turn, chessboard, queen);
  }
  routes = orderArrays(routes)

  routes = deleteEmptyArrays(routes)
  routes = pickLongestArrays(routes)
  routes = deleteEmptyArrays(routes)

  shortRoutes = filterUnderTwoLength(routes);



}

function filterUnderTwoLength(routes) {
  let array = [];
  for (let route of routes) {
    if (route.length >= 2) {
      array.push(route)
    }
  }
  return array;
}



function unhighlightAllYellowPieces() {
  let piece;
  let pieceCenter;

  if (globalTurn == "white") {
    piece = "yellow-white"
    pieceCenter = "yellow-center-white";
  } else {
    piece = "yellow-black";
    pieceCenter = "yellow-center-black";
  }


  for (let i = 0; i < globalSemanticChessboard.length; i++) {
    if (globalSemanticChessboard[i]["piece"]) {
      let highlightedPiece = document.getElementById(i).firstElementChild;
      let centerOfHighlightedPiece = highlightedPiece.firstElementChild;

      highlightedPiece.classList.remove(piece);
      centerOfHighlightedPiece.classList.remove(pieceCenter)
    }
  }



}

function pickLongestArrays(array) {
  let longestArray = [];
  for (let i = 0; i < array.length; i++) {
    if(array[i].length > longestArray.length) {
      longestArray = array[i];
    }
  }
  let returnArrays = [];
  returnArrays.push(longestArray);
  for (let i = 0; i < array.length; i++) {
    if(array[i].length == longestArray.length && array[i] != longestArray) {
      returnArrays.push(array[i])
    }
  }
  return returnArrays
}



function orderArrays(routes) {
  let tempArray = [];
  let returnArray = [];
  for (let i = 0; i < routes.length; i++) {
    if (routes[i]) {
      tempArray.push(routes[i])
    } else {
      returnArray.push(tempArray);
      tempArray = [];
    }
  }
  return returnArray;
}

function deleteEmptyArrays(arrays) {
  let array = [];
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length > 0) {
      array.push(arrays[i])
    }
  }
  return array;
}

function deleteRepetition(arrays) {
  let array = [];
  for (let i = 0; i < arrays.length; i++) {
    let tempArray = [];
    for (let j = 0; j < arrays[i].length; j++) {
      if (tempArray.includes(arrays[i][j])) {
        tempArray = [];
        j = arrays[i].length -1
      } else {
        tempArray.push(arrays[i][j])
      }
    }
    array.push(tempArray);
  }
  return array;
}





function calculateComboRoute(move, turn, chessboard, queen) {
  levelArray[level] = move;
  chessboard[levelArray[0]]["piece"] = "";

  let allMoves = estimateMoves(move, turn, chessboard);
  let moves = allMoves[0];
  let killMoves = allMoves[1];
  moves = cutOffMovesWhenNoKill(move, moves, killMoves, chessboard, turn, queen)
  //console.log("Level: " + level)
  //console.log("I am at: " + move)
  //console.log("Here are my options: " + moves);

  level++

  if (prevMoves[prevMoves.length -2] == move) {
    let indexOfMove = moves.indexOf(move);
    moves[indexOfMove] = "";
  }
    prevMoves.push(move)

  if (!moves.some(arg=> Number.isInteger(arg))) {
    levelArray[level] = "";
    routes = routes.concat(levelArray);
    level --;
    return;
  }

  if (moves.includes(levelArray[levelArray.length - 2])) {
    let index = moves.indexOf(levelArray[levelArray.length - 2])
    moves[index] = "";
  }
  if (levelArray[0] == levelArray[4] || levelArray[0] == levelArray[5] || levelArray[0] == levelArray[6]) {
    return;
  }
  moves.forEach(function(arg) {

    if (arg) {
      let killMove = returnSingleKill(move, arg, killMoves);
      if (killMove) {
        chessboard[killMove]["piece"] = "";
      }
      if (queen) {
        chessboard[arg]["queen"] = true;
      }
      calculateComboRoute(arg, turn, chessboard, queen)
    }
  }
)

  levelArray[level] = ""
  routes = routes.concat(levelArray)
  level --;
  return
}



function returnSingleKill(selectedSquare, move, killMoves) {
  for (let killMove of killMoves) {
    if ((selectedSquare - move) % 9 == 0 && (selectedSquare - killMove) % 9 == 0 && (move < killMove && killMove < selectedSquare) || (move > killMove && killMove > selectedSquare)) {
      return killMove;
    } else if ((selectedSquare - move) % 7 == 0 && (selectedSquare - killMove) % 7 == 0 && (move < killMove && killMove < selectedSquare) || (move > killMove && killMove > selectedSquare)) {
      return killMove
    }
  }
  return false;
}


function makeMove(move, killMove, turn, semanticChessboard, selectedSquare) {

  //console.log("MOVING FROM: " + selectedSquare);
  //console.log("MOVING TO: " + move);
  //console.log("KILLING: " + killMove);


  let moveSquareDiv = document.getElementById(move);
  let moveFromDiv = document.getElementById(selectedSquare);

  if (semanticChessboard[selectedSquare]["queen"]) {
    turn == "white"? moveSquareDiv.innerHTML = whiteQueen : moveSquareDiv.innerHTML = blackQueen;
    globalSemanticChessboard[move]["piece"] = turn;
    globalSemanticChessboard[move]["queen"] = true;

    moveFromDiv.innerHTML = "";
    globalSemanticChessboard[selectedSquare]["piece"] = "";
    globalSemanticChessboard[selectedSquare]["queen"] = false;
  } else {
    turn == "white"? moveSquareDiv.innerHTML = whitePiece : moveSquareDiv.innerHTML = blackPiece;
    globalSemanticChessboard[move]["piece"] = turn;

    moveFromDiv.innerHTML = "";
    globalSemanticChessboard[selectedSquare]["piece"] = "";
  }

  if (killMove) {
    let killedSquare = document.getElementById(killMove);
    killedSquare.innerHTML = "";
    globalSemanticChessboard[killMove]["piece"] = "";
    globalSemanticChessboard[killMove]["queen"] = false;
  }

}





// -------------------------------------------------------------------------------------------------------------------------------
function calculateQueenMoves(selectedNumSquare, moveDirection, turn, semanticChessboard) {

  let queenNumMove = selectedNumSquare;
  let border1;
  let border2;

  switch (moveDirection) {
    case -9:
    border1 = "border-left";
    border2 = "border-top";
    break;
    case -7:
    border1 = "border-top";
    border2 = "border-right";
    break;
    case 9:
    border1 = "border-right";
    border2 = "border-bot";
    break;
    case 7:
    border1 = "border-bot";
    border2 = "border-left";
    break;
  }

  let moves = [];
  let friendlyPieces = [];
  let enemyPieces = [];
  let movesToRemove = [];;
  let enemyWall = [];
  let pieceToKill;

  while (!semanticChessboard[queenNumMove][border1] && !semanticChessboard[queenNumMove][border2]) {
    queenNumMove += moveDirection;
    moves.push(queenNumMove);
  }


  for (let move of moves) {
    if (semanticChessboard[move]["piece"] == turn) {
      friendlyPieces.push(move)
    } else if (semanticChessboard[move]["piece"]) {
      enemyPieces.push(move);
    }

    if (semanticChessboard[move]['piece'] && enemyPieces[0]) {
      movesToRemove.push(move)
    }
    for (let i = 0; i < enemyPieces.length -1; i++) {
      if ((enemyPieces[i] - enemyPieces[i+1]) == -moveDirection) {
        enemyWall.push(enemyPieces[i+1]);
      }
    }

    if ((semanticChessboard[move][border1] || semanticChessboard[move][border2]) && semanticChessboard[move]["piece"]) {
      movesToRemove.push(move)
    }
  }


  friendlyPieces.sort();
  enemyWall.sort();

  let moveBorder
  let movesToRemove2 = [];



  if (moveDirection < 0) {
    friendlyPieces.reverse();
    enemyWall.reverse();
    enemyPieces.reverse();
    if (friendlyPieces[0]) {
      for (let move of moves) {
        if(move <= friendlyPieces[0]) {
          movesToRemove.push(move)
        }
      }
    }
    if (enemyWall[0]) {
      for (let move of moves) {
        if (move <= enemyWall[0]) {
          movesToRemove.push(move)
        }
      }
    }
    friendlyPieces.sort(function(a, b){return b - a});
    enemyPieces.sort(function(a, b){return b - a});
    if (!enemyWall.includes(enemyPieces[0]) && semanticChessboard[enemyPieces[0] + moveDirection] && !semanticChessboard[enemyPieces[0] + moveDirection]['piece']) {
      if ((!semanticChessboard[enemyPieces[0]][border1] && !semanticChessboard[enemyPieces[0]][border2])) {
        if (!friendlyPieces[0] || friendlyPieces[0] < enemyPieces[0]) {
          pieceToKill = enemyPieces[0];
        }

      }
    }
    let pieceSpotted = 0;
    for (let move of moves) {
      if (pieceToKill && semanticChessboard[move]["piece"]) {
        pieceSpotted ++;
      }
      if (pieceSpotted == 2 && !moveBorder) {
        moveBorder = move;
      }
    }

    for (let move of moves) {
      if (move <= moveBorder) {
        movesToRemove2.push(move);
      }
    }



  } else if (moveDirection > 0) {
    if (friendlyPieces[0]) {
      for (let move of moves) {
        if(move >= friendlyPieces[0]) {
          movesToRemove.push(move)
        }
      }
    }

    if (enemyWall[0]) {
      for (let move of moves) {
        if (move >= enemyWall[0]) {
          movesToRemove.push(move)
        }
      }
    }


    enemyPieces.sort(function(a, b){return a - b});
    friendlyPieces.sort(function(a, b){return b - a});

    if (!enemyWall.includes(enemyPieces[0]) && semanticChessboard[enemyPieces[0] + moveDirection] && !semanticChessboard[enemyPieces[0] + moveDirection]['piece']) {
      if ((!semanticChessboard[enemyPieces[0]][border1] && !semanticChessboard[enemyPieces[0]][border2])) {
        if (!friendlyPieces[0] || friendlyPieces[0] > enemyPieces[0]) {
          pieceToKill = enemyPieces[0];
        }

      }
    }
    let pieceSpotted = 0;
    for (let move of moves) {
      if (semanticChessboard[move]["piece"]) {
        pieceSpotted ++;
      }
      if (pieceSpotted == 2 && !moveBorder) {
        moveBorder = move;
      }
    }

    for (let move of moves) {
      if (move >= moveBorder) {
        movesToRemove2.push(move);
      }
    }

  }
  let filteredMoves = moves.filter((move) => !movesToRemove.includes(move));
  let filteredMoves2 = filteredMoves.filter((move) => !movesToRemove2.includes(move));


  return [filteredMoves2, [pieceToKill]]
}



function estimateMoves(selectedNumSquare, turn, semanticChessboard) {

  if(semanticChessboard[selectedNumSquare]["queen"]) {
    let leftTopMove = []
    let rightTopMove = []
    let rightDownMove = []
    let leftDownMove = []

    let leftTopKill = []
    let rightTopKill = []
    let rightDownKill = []
    let leftDownKill = []


    let leftTopMoves = calculateQueenMoves(selectedNumSquare, -9, turn, semanticChessboard)
    let rightTopMoves = calculateQueenMoves(selectedNumSquare, -7, turn, semanticChessboard)
    let rightDownMoves = calculateQueenMoves(selectedNumSquare, 9, turn, semanticChessboard)
    let leftDownMoves = calculateQueenMoves(selectedNumSquare, 7, turn, semanticChessboard)

    leftTopMove = leftTopMoves[0]
    rightTopMove = rightTopMoves[0]
    rightDownMove = rightDownMoves[0]
    leftDownMove = leftDownMoves[0]

    leftTopKill = leftTopMoves[1]
    rightTopKill = rightTopMoves[1]
    rightDownKill = rightDownMoves[1]
    leftDownKill = leftDownMoves[1]




    let moves = leftTopMove.concat(rightTopMove, rightDownMove, leftDownMove);
    let killMoves = leftTopKill.concat(rightTopKill, rightDownKill, leftDownKill);


    return [moves, killMoves];
  }


  let move1;
  let move2;
  let move3;
  let move4;
  let moves1;
  let moves2;
  let moves3;
  let moves4;
  let moveDirection1;
  let moveDirection2;
  let killMove1;
  let killMove2;
  let killMove3;
  let killMove4;


  if (turn == "white") {
    moveDirection1 = -9;
    moveDirection2 = -7;
  } else {
    moveDirection1 = 7;
    moveDirection2 = 9;
  }

  if (selectedNumSquare) {
    move1 = +selectedNumSquare + moveDirection1;
    move2 = +selectedNumSquare + moveDirection2;
    move3 = +selectedNumSquare - moveDirection1;
    move4 = +selectedNumSquare - moveDirection2;


    move1 = checkMoveForDeadEnd(move1, moveDirection1, semanticChessboard, turn)
    move2 = checkMoveForDeadEnd(move2, moveDirection2, semanticChessboard, turn)
    move3 = checkMoveForDeadEnd(move3, -moveDirection1, semanticChessboard, turn)
    move4 = checkMoveForDeadEnd(move4, -moveDirection2, semanticChessboard, turn)


    moves1 = checkIfThereIsAKill(move1, moveDirection1, semanticChessboard, turn);
    moves2 = checkIfThereIsAKill(move2, moveDirection2, semanticChessboard, turn);
    moves3 = checkIfThereIsAKill(move3, -moveDirection1, semanticChessboard, turn);
    moves4 = checkIfThereIsAKill(move4, -moveDirection2, semanticChessboard, turn);

    move1 = moves1[0]
    move2 = moves2[0]
    move3 = moves3[0]
    move4 = moves4[0]

    killMove1 = moves1[1];
    killMove2 = moves2[1];
    killMove3 = moves3[1];
    killMove4 = moves4[1];


    move1 = makeSureThereIsNoDeadEnd(move1, moveDirection1, semanticChessboard, turn);
    move2 = makeSureThereIsNoDeadEnd(move2, moveDirection2, semanticChessboard, turn);

    move3 = killMove3 ? move3 : "";
    move4 = killMove4 ? move4 : "";


    return [[move1, move2, move3, move4], [killMove1, killMove2, killMove3, killMove4]];
  }
}



function checkMoveForDeadEnd(move, moveDirection, semanticChessboard, turn) {
  let moveSquare = semanticChessboard[move];
  if (!move) {;
    return "";
  } else if (move > 63 || move < 0) {
    return "";
  }


  if (moveSquare["border-right"] && (moveDirection == -9 || moveDirection == 7)) {
    return "";
  } else if (moveSquare["border-left"] && (moveDirection == -7 || moveDirection == 9)) {
    return "";
  } else if (moveSquare["square"] == "white") {
    return "";
  } else if (moveSquare["piece"] && semanticChessboard[move + moveDirection] && semanticChessboard[move + moveDirection]["piece"]) {
    return "";
  } else if (moveSquare["piece"] == turn) {
    return "";
  } else {
    return move;
  }
}



// zwraca [move, pionek do zbicia ]
function checkIfThereIsAKill(move, moveDirection, semanticChessboard, turn) {

  let selSquare = semanticChessboard[move + moveDirection];
  // jesli move nie istnieje
  if (!move) {
    //console.log("gate1")
    return ["", ""];

  } else if ((move + moveDirection) > 63 || (move + moveDirection) < 0) {
    //console.log("gate2")
    return [move, ""];
  }
  let moveSquare = semanticChessboard[move];
  // jesli pionek znajduje sie na granicy planszy

  if (!moveSquare["piece"]) {
    //console.log("gate4")
    return [move, ""];
    // jeslli na przeciwko stoi friendly pionek
  } else if (moveSquare["piece"] == turn) {
    //console.log("gate5")
    return [move, ""];
    // jesli na przeciwko mamy granicę planszy
  } else if (moveSquare["border-top"] || moveSquare["border-bot"]) {
    //console.log("gate6")
    return [move, ""];
    // jesli za pionkiem do zbicia stoi inny pionek
  } else if (semanticChessboard[move + moveDirection] && semanticChessboard[move + moveDirection]['piece']) {
    //  console.log("gate7")
    return [move, ""];
  } else if (semanticChessboard[move + moveDirection]["square"] == "white") {
    //  console.log("gate8")
    return [move, ""];
  } else if (semanticChessboard[move + moveDirection]["border-right"] && (moveDirection == -9 || moveDirection == 7)) {
    //console.log("gate9")
    return [move, ""];
  } else if (semanticChessboard[move + moveDirection]["border-left"] && (moveDirection == -7 || moveDirection == 9)) {
    //console.log("gate10")
    return [move, ""];
  }
  //console.log("gate11")
  let pieceToKill = move;
  move += moveDirection;
  return [move, pieceToKill];
}

function makeSureThereIsNoDeadEnd(move, moveDirection, semanticChessboard, turn) {
  if (move && semanticChessboard[move]["piece"]) {
    return ""
  } else return move;
}


function checkIfThereIsCombo(squareId, turn, semanticChessboard) {
  let allMoves = estimateMoves(squareId, turn, semanticChessboard);
  let killMoves = allMoves[1];
  if (killMoves.some((killMove) => Number.isInteger(killMove))) {
    return killMoves
  } else {
    return false
  }
}

function makeQueen(squareId, turn) {
  globalSemanticChessboard[squareId]["queen"] = true;
  let squareDiv = document.getElementById(squareId);
  turn == "white" ? squareDiv.innerHTML = whiteQueen : squareDiv.innerHTML = blackQueen;
}



function highlightMoves(moves) {

  for (let i = 0; i < moves.length; i++) {
    let move = moves[i];
    if(move) {
      document.getElementById(move).setAttribute(
        "style", `-webkit-box-shadow: inset 0px 0px 33px 14px rgba(21,255,0,0.41);
        -moz-box-shadow: inset 0px 0px 33px 14px rgba(21,255,0,0.41);
        box-shadow: inset 0px 0px 33px 14px rgba(21,255,0,0.41);`);
      }
    }
  }

function unhighlightAllMoves() {
  for (let i = 0; i < globalSemanticChessboard.length; i++) {
    document.getElementById(i).setAttribute(
      "style", `-webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none`);
    }
  }

function unhighlightAllPieces() {

  let centerPieceClass
  let pieceClass

  let centerKillPieceClass
  let pieceKillClass

  let centerYellowPieceClass
  let pieceYellowClass;

  if (globalTurn == "white") {
    centerPieceClass = "selectedCenterOfWhitePiece";
    pieceClass = "selectedWhitePiece";

    centerYellowPieceClass = "yellow-white";
    pieceYellowClass = "yellow-center-white";


    centerKillPieceClass = "toKill-center-black";
    pieceKillClass = "toKill-black"

  } else {
    centerPieceClass = "selectedCenterOfBlackPiece";
    pieceClass = "selectedBlackPiece";

    centerYellowPieceClass = "yellow-black";
    pieceYellowClass = "yellow-center-black";

    centerKillPieceClass = "toKill-center-white";
    pieceKillClass = "toKill-white"
  }

  for (let i = 0; i < globalSemanticChessboard.length; i++) {
    if (document.getElementById(i).firstElementChild) {
      let highlightedPiece = document.getElementById(i).firstElementChild;
      let centerOfHighlightedPiece = highlightedPiece.firstElementChild;

      centerOfHighlightedPiece.classList.remove(centerPieceClass);
      highlightedPiece.classList.remove(pieceClass);


      centerOfHighlightedPiece.classList.remove(centerYellowPieceClass);
      highlightedPiece.classList.remove(pieceYellowClass);

      centerOfHighlightedPiece.classList.remove(centerKillPieceClass);
      highlightedPiece.classList.remove(pieceKillClass);
    }
  }
}



function highlightSelectedPiece(selectedNumSquare, semanticChessboard, turn, yellow) {
    if(selectedNumSquare && semanticChessboard[selectedNumSquare]["piece"] == turn) {
      let highlightedPiece = document.getElementById(selectedNumSquare).firstElementChild;
      let centerOfHighlightedPiece = highlightedPiece.firstElementChild;

      let centerPieceClass
      let pieceClass
      if (turn == "white" && yellow) {
        centerPieceClass = "yellow-center-white";
        pieceClass = "yellow-white";
      } else if (turn == "black" && yellow) {
        return
      } else if (turn == "white") {
        centerPieceClass = "selectedCenterOfWhitePiece";
        pieceClass = "selectedWhitePiece";
      } else {
        return
      }
      centerOfHighlightedPiece.classList.add(centerPieceClass);
      highlightedPiece.classList.add(pieceClass);
    }
  }

function highlightPiecesToKill(killMoves, turn) {
    killMoves.forEach((killMove) => {
      if (killMove) {
        let highlightedPiece = document.getElementById(killMove).firstElementChild;
        let centerOfHighlightedPiece = highlightedPiece.firstElementChild;

        let centerPieceClass
        let pieceClass

        if (turn == "white") {
          centerPieceClass = "toKill-center-black";
          pieceClass = "toKill-black";
        } else {
          centerPieceClass = "toKill-center-white";
          pieceClass = "toKill-white";
        }

        centerOfHighlightedPiece.classList.add(centerPieceClass);
        highlightedPiece.classList.add(pieceClass);
      }
    }
  )
}

checkAllPiecesForForcedKill(globalSemanticChessboard, globalTurn)

function highlightForcedPieces() {
  for (let i = 0; i < routes.length; i++) {
    highlightSelectedPiece(routes[i][0], globalSemanticChessboard, globalTurn, true);
  }
}

function createSemanticChessboard(board) {
  for (let i = 0; i < 64; i++) {

      let square = board.push({
        id: i,
        piece: "",
        square: "white",
      })

      if(i % 2 != 0 && i <= 7) {
        board[i]["square"] = "black";
      } else if(i % 2 == 0 && i > 7 && i <= 14) {
        board[i]["square"] = "black";
      } else if(i % 2 != 0 && i > 15 && i <= 23) {
        board[i]["square"] = "black";
      } else if(i % 2 == 0 && i > 23 && i <= 31) {
        board[i]["square"] = "black";
      } else if(i % 2 != 0 && i > 31 && i <= 39) {
        board[i]["square"] = "black";
      } else if(i % 2 == 0 && i > 39 && i <= 47) {
        board[i]["square"] = "black";
      } else if(i % 2 != 0 && i > 47 && i <= 55) {
        board[i]["square"] = "black";
      } else if(i % 2 == 0 && i > 55 && i <= 63) {
        board[i]["square"] = "black";
      }

      switch(i) {
        case 1:
        case 3:
        case 5:
        board[i]["border-top"] = true;
        break;
        case 58:
        case 60:
        case 62:
        board[i]["border-bot"] = true;
        break;
        case 8:
        case 24:
        case 40:
        board[i]["border-left"] = true;
        break;
        case 56:
        board[i]["border-left"] = true;
        board[i]["border-bot"] = true;
        break;
        case 7:
        board[i]["border-top"] = true;
        board[i]["border-right"] = true;
        break;
        case 23:
        case 39:
        case 55:
        board[i]["border-right"] = true;
        break;
      }
    }
}

function addPieces(chessboard) {
  for (let i = 0; i < 64; i++) {
    if(chessboard[i]["square"] == "black" && i <= 23) {
      chessboard[i]["piece"] = "black";
      let square = document.getElementById(i);
      square.innerHTML = blackPiece;
    } else if (chessboard[i]["square"] == "black" && i > 39) {
      chessboard[i]["piece"] = "white";
      let square = document.getElementById(i);
      square.innerHTML = whitePiece;
    }
  }
}


function returnKillMove (selectedSquare, squareId, killMoves) {
  if (globalSemanticChessboard[selectedSquare]['queen']) {
    let diff = (squareId - selectedSquare);
    //  console.log(killMoves)
    if (diff < 0 && diff % 9 == 0)  {
      //   console.log('gate1')
      return killMoves[0]
    } else if (diff < 0 && diff % 7 == 0) {
      // console.log('gate2')
      return killMoves[1]
    } else if (diff > 0 &&  diff % 9 == 0) {
      // console.log('gate3')
      return killMoves[2]
    } else if (diff > 0 &&  diff % 7 == 0) {
      //  console.log('gate4')
      return killMoves[3]
    }
  }

  if (selectedSquare - 14 == squareId && killMoves.includes(selectedSquare - 7)) {
    return selectedSquare - 7
  } else if (selectedSquare + 14 == squareId && killMoves.includes(selectedSquare + 7)) {
    return selectedSquare + 7
  } else if (selectedSquare - 18 == squareId && killMoves.includes(selectedSquare - 9)) {
    return selectedSquare - 9;
  } else if (selectedSquare + 18 == squareId && killMoves.includes(selectedSquare + 9)) {
    return selectedSquare + 9;
  } else {
    return "";
  }
}

function cutOffMovesWhenNoKill(selectedNumSquare, moves, killMoves, semanticChessboard, turn) {
  if (semanticChessboard[selectedNumSquare]["queen"]) {

    let leftTopMoves = calculateQueenMoves(selectedNumSquare, -9, turn, semanticChessboard)
    let rightTopMoves = calculateQueenMoves(selectedNumSquare, -7, turn, semanticChessboard)
    let rightDownMoves = calculateQueenMoves(selectedNumSquare, 9, turn, semanticChessboard)
    let leftDownMoves = calculateQueenMoves(selectedNumSquare, 7, turn, semanticChessboard)

    leftTopMove = leftTopMoves[0]
    rightTopMove = rightTopMoves[0]
    rightDownMove = rightDownMoves[0]
    leftDownMove = leftDownMoves[0]

    leftTopKill = leftTopMoves[1]
    rightTopKill = rightTopMoves[1]
    rightDownKill = rightDownMoves[1]
    leftDownKill = leftDownMoves[1]

    let moves = [leftTopMove, rightTopMove, rightDownMove, leftDownMove]
    let killMoves = [leftTopKill, rightTopKill, rightDownKill, leftDownKill]
    let directions = [-9, -7, 9, 7];

    let filteredMoves = []



    for (let i = 0; i < moves.length; i++) {
      for (let j = 0; j < moves[i].length; j++) {
        if (i < 2) {
          if (killMoves[i].some(arg=> Number.isInteger(arg)) && moves[i][j] < killMoves[i]) {
            filteredMoves.push(moves[i][j])
          }
        } else {
          if (killMoves[i].some(arg=> Number.isInteger(arg)) && moves[i][j] > killMoves[i]) {
            filteredMoves.push(moves[i][j])
          }
        }
      }
    }

    return filteredMoves

  } else {
    let filteredMoves = [];
    for (let i = 0; i < moves.length; i++) {
      if(!killMoves[i]) {
        filteredMoves.push("")
      } else if (moves[i]) {
        filteredMoves.push(moves[i]);
      }
    }
    return filteredMoves;
  }
}

function displayWinTitle(winner) {
  let titleText;
  let titleDiv = document.getElementById("win-title");
  let letterSpacing;
  let playAgainDiv = document.getElementById("play-again");
  if (winner == "white") {
    titleText = whiteWin;
    letterSpacing = "letter-spacing: 5px";
    transform = "transform: translate(-51%);";
  } else {
    titleText = blackWin;
    letterSpacing = "letter-spacing: 3px";
    transform = "transform: translate(-48%)";
  }
  titleDiv.setAttribute("style", transform);
  titleDiv.innerHTML = titleText;
  titleDiv.setAttribute("style", "display: block")
  document.getElementById("h1-win").setAttribute("style", letterSpacing);
  playAgainDiv.setAttribute("style", "display: inline-block");

  playAgainDiv.onclick = function() {
    startNewGame();
  }
}



let papaje = new Map;

function generujPapaja() {

  let id = Math.floor(Math.random() * 10) + Date.now();
  let img = document.createElement("img");
  let orientation = Math.floor(Math.random() * 4);


  img.src = "./img/papaj.png";
  img.alt = "papaj";
  img.className ="papaj";
  img.id = "papaj" + id;
  if (orientation == 0) {                                     //GORA
    img.style.transform = "rotate(180deg)";
    img.style.left = Math.floor(Math.random() * 101) + "%"
    img.style.top = 0;
  } else if (orientation == 1) {                              //PRAWO
    img.style.transform = "rotate(270deg)"
    img.style.right = 0;
    img.style.bottom = Math.floor(Math.random() * 85) + "%";
  } else if (orientation == 2) {                              //DOL
    img.style.bottom = 0;
    img.style.left = Math.floor(Math.random() * 101) + "%"
  } else {                                                    //LEWO
    img.style.transform = "rotate(90deg)"
    img.style.left = 0;
    img.style.bottom = Math.floor(Math.random() * 85) + "%";
  }

  let direction;

  switch (orientation) {
    case 0:
      direction = "top";
      break;
    case 1:
      direction = "right";
      break;
    case 2:
      direction = "bottom";
      break;
    case 3:
      direction = "left";
      break;
  }



  document.getElementById('container').append(img);
  papaje.set(id, true);
  wysunPapaja(id, direction);

  img.addEventListener("click", function() {
    schowajSzybkoPapaja(id, direction)
  })

}


async function wysunPapaja(id, direction) {

  let papaj = document.getElementById("papaj"+id);

  let delay = 50;

  for (let i = -100; i < -40; i++) {
    if (!papaje.get(id)) {
      break;
    }

    if (i > -50) {
      delay += 10;
    } else if (i > -60) {
      delay += 5;
    }
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();

      }, delay);
      papaj.style[direction] = i + "px";
    })
  }
  await new Promise((resolve) => {setTimeout(()=>{resolve()},1000)})
  schowajPapaja(id, direction);
}


async function schowajPapaja(id, direction) {
  let papaj = document.getElementById("papaj"+id);

  let delay = 90;
  for (let i = parseInt(papaj.style[direction]); i > -120; i = i-1) {

    delay -= 1;

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();

      }, delay);
      papaj.style[direction] = i + "px";
    })
  }
  papaj.remove();
}


async function schowajSzybkoPapaja(id, direction) {
  let papaj = document.getElementById("papaj"+id);
  papaje.delete(id);

  delay = 1;

  sounds[Math.floor(Math.random()*5)].play();

  for (let i = parseInt(papaj.style[direction]); i > -101; i = i-2) {

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();

      }, delay);
      papaj.style[direction] = i + "px";
    })
  }
  papaj.remove();
}

let sounds = generateSounds();

function generateSounds() {
  let sounds = [];
  for (let i = 0; i < 5; i++) {
    let sound = document.createElement("audio");
    sound.src = `./sound/${i}.mp4`;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    sounds.push(sound);
  }
  return sounds;
}
