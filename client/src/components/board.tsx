import React from "react";

import Chessboard from "./board/Chessboard";
import Label from "./Label";

import Game, { GAMEMODE } from "../game";
import { Color } from "./board/getPieceJSX";
import { socket } from "../main";
import { ISquare } from "../engine";
import { IPlayer } from "./lobby/Lobby";
import { Rematch } from "../App";

export interface GameInfo {
  chessboard: ISquare[];
  id: number | undefined;
  turn: "black" | "white";
  winner: "black" | "white" | "";
  roomId: string;
};

interface State {
  contextMenu: {
    piece: string;
    queen: boolean;
    i: number;
    clientX: number;
    clientY: number;
    showMenu: boolean;
  };
  winner: "" | Color;
};
interface Props {
  game: Game;
    restartGame: (gameId: number) => void;
    player: IPlayer;
    rematches: Rematch[];
};

export default class Board extends React.Component<Props, State> {


  interval: ReturnType<typeof setTimeout> | null;
  contextMenuRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.state = {
      contextMenu: {
        piece: "",
        queen: false,
        i: 0,
        clientX: 0,
        clientY: 0,
        showMenu: false,
      },
      winner: "",
    };
    this.contextMenuRef = React.createRef();
    this.interval = null;
  }

  setWinner = (winner: Color) => {
    this.setState({
      winner: winner,
    });
  };

  clickHandler = (event: any) => {
    this.props.game.clickHandler(event);
    if (this.props.game.gameMode == GAMEMODE.ONLINE && this.props.game.roomId) {
      let gameInfo: GameInfo = {
        chessboard: this.props.game.engine.chessboard,
        id: this.props.game.id,
        turn: this.props.game.engine.turn,
        winner: this.props.game.engine.winner,
        roomId: this.props.game.roomId,
      };
      socket.emit("make_move", gameInfo);
    }
  };

  hideContextMenu = () => {
    this.setState((prevState) => {
      return {
        contextMenu: { ...prevState.contextMenu, showMenu: false },
      };
    });
  };

  onContextHandler = (event: any) => {
    event.preventDefault();
    let engine = this.props.game.engine;

    let square = event.target.closest(".chessboard__square");
    if (
      square &&
      square.className !== "chessboard__square chessboard__square--white"
    ) {
      let id = square.getAttribute("id");
      const queen = engine.chessboard[id]["queen"];
      const piece = engine.chessboard[id]["piece"];
      let clientRect = square.getBoundingClientRect();
      let clientX = clientRect.left;
      let clientY = clientRect.top;
      const width = square.offsetWidth;
      const height = square.offsetHeight;
      clientX += width / 2;
      clientY += height / 2 + 10;

      this.setState({
        contextMenu: {
          piece: piece,
          queen: queen,
          i: id,
          clientX: clientX,
          clientY: clientY,
          showMenu: true,
        },
      });
    }

    return false;
  };

  render() {
    if (restartFlag) {
      restartFlag = false;
    }
    let engine = this.props.game.engine;
    const rematch = this.props.rematches.find(
      (r) => r.gameId == this.props.game.id
    );

    return (
      <div
        className="board"
        onClick={this.clickHandler}
        onContextMenu={this.onContextHandler}
      >
        <Label side="top"/>
        <Label side="left"/>
        <Label side="right"/>
        <Chessboard
          engine={engine}
          preview={false}
          game={this.props.game}
          setWinner={this.setWinner}
          restartGame={this.props.restartGame}
          player={this.props.player}
          rematch={rematch}
        />
        <Label side="bot"/>
      </div>
    );
  }
}

let restartFlag = false;
