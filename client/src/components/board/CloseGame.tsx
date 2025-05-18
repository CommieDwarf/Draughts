import React from "react";
import Game, { GAMEMODE } from "../../Game";
import { socket } from "../../main";

type Props = {
  closeGame?: (gameId: number) => void;
  game: Game;
  gameId: number;
};

export default function CloseGame(props: Props) {
  function handleClick() {
    if (props.closeGame) {
      props.closeGame(props.gameId);
      if (props.game.gameMode == GAMEMODE.ONLINE) {
        socket.emit("player-close-game", {
          gameId: props.game.id,
          roomId: props.game.roomId,
        });
      }
    }
  }

  return (
    <div className="game-preview__close-game" onClick={handleClick}>
      <i className="icon-cancel-circled"></i>
    </div>
  );
}
