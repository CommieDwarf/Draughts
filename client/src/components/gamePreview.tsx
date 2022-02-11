import React from "react";
import Chessboard from "./board/chessboard";
import Game from "../game";
import { isPropertySignature } from "typescript";

type Props = {};
type State = {
  mouseOver: boolean;
};

export default class GamePreview extends React.Component<Props, State> {
  props: {
    games: Game[];
    switchGame: (id: number) => void;
    closeGame: (counter: number, gameId?: number) => void;
  };

  gamePreviewRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.props = props;
    this.gamePreviewRef = React.createRef();
    this.state = {
      mouseOver: false,
    };
  }

  handleScroll = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      console.log("scrolling up");
      this.gamePreviewRef.current?.scrollBy(-30, 0);
    } else if (event.deltaY > 0) {
      this.gamePreviewRef.current?.scrollBy(30, 0);
      console.log("scrolling down");
    }
    return false;
  };

  handleMouseOver = () => {
    document.body.setAttribute("style", "overflow-y: hidden");
  };
  handleMouseLeave = () => {
    document.body.setAttribute("style", "overflow-y: auto");
  };



  render() {
    const games = this.props.games.map((game, i) => {
      return (
        <Chessboard
          engine={game.engine}
          preview={true}
          key={i}
          label={game.label}
          game={game}
          closeGame={this.props.closeGame}
          switchGame={this.props.switchGame}
        />
      );
    });

    return (
      <div
        className="game-preview"
        onWheel={this.handleScroll}
        ref={this.gamePreviewRef}
        onMouseOver={this.handleMouseOver}
        onMouseLeave={this.handleMouseLeave}
      >
        {games}
      </div>
    );
  }
}
