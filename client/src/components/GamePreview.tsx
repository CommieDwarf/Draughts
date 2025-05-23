import React from "react";
import Chessboard from "./board/Chessboard";
import Game from "../Game";

interface Props {
  games: Game[];
  switchGame: (id: number) => void;
  closeGame: (counter: number, gameId?: number) => void;
  currentGame: Game | null;
};
interface State {
  mouseOver: boolean;
};

export default class GamePreview extends React.Component<Props, State> {


  gamePreviewRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.gamePreviewRef = React.createRef();
    this.state = {
      mouseOver: false,
    };
  }

  handleScroll = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      this.gamePreviewRef.current?.scrollBy(-30, 0);
    } else if (event.deltaY > 0) {
      this.gamePreviewRef.current?.scrollBy(30, 0);
    }
    return false;
  };

  render() {
    const games = this.props.games.map((game, i) => {
      let current = false;
      if (game == this.props.currentGame) {
        current = true;
      }
      return (
        <Chessboard
          engine={game.engine}
          preview={true}
          key={i}
          label={game.label}
          game={game}
          closeGame={this.props.closeGame}
          switchGame={this.props.switchGame}
          current={current}
        />
      );
    });

    return (
      <div
        className="game-preview"
        onWheel={this.handleScroll}
        ref={this.gamePreviewRef}
      >
        {games}
      </div>
    );
  }
}
