const enum SIDE {
  NORMAL,
  REVERSED,
  CUSTOM,
}

export interface IPreset {
  whitePieces: number[];
  blackPieces: number[];
  turn: string;
  queen?: number[];
  playerSide: string,
  whiteSide: string,
}



function getPreset(side: SIDE) {
  switch (+side) {
    case SIDE.CUSTOM:
      return  {
      //   whitePieces: [33, 49, 51, 53, 62],
      //  blackPieces: [26, 28, 21],
        whitePieces: [42],
        blackPieces: [49],
  
        whiteSide: "bot",
        playerSide: "bot", // this is current turn side. player is always on bottom
        turn: "white",
        queen: [],
      };
      break;
    case SIDE.NORMAL:
      return {
        whitePieces: [62, 60, 58, 56, 55, 53, 51, 49, 46, 44, 42, 40],
        blackPieces: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23],
        playerSide: "bot",
        whiteSide: "bot",
        turn: "white",
        queen: []
      };
      break;
    case SIDE.REVERSED:
      return {
        whitePieces: [1, 3, 5, 7, 8, 10, 12, 14, 17, 19, 21, 23],
        blackPieces: [62, 60, 58, 56, 55, 53, 51, 49, 46, 44, 42, 40],
        playerSide: "top",
        whiteSide: "top",
        turn: "white",
        queen: []
      };
      break;
  }
}


export {SIDE, getPreset };