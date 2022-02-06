import React, { useEffect, useState } from 'react';
import { SIDE } from '../../config';
import Game, { GAMEMODE } from '../../game';
import ColorSelection from "./colorSelection";

type Color = "black" | "white";

type Props = {
    title: string,
    gameMode: GAMEMODE,
    startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string) => boolean;
    label: string,
    games: Game[],
}

export default function StartGame(props: Props) {
  
  const [error, setError] = useState("");

  useEffect(() => {
    if (props.games.length < 4) {
      setError("");
    }
  }, [props.games])


  return (
  <div className="game-menu__start-game">
    <h3>{props.title}</h3>
    <ColorSelection color="white" gameMode={props.gameMode}
    startNewGame={props.startNewGame} label={props.label}
    setError={setError}
    />
    <ColorSelection color="black" gameMode={props.gameMode}
     startNewGame={props.startNewGame} label={props.label}
     setError={setError}
     />
    <p className="game-menu__error">{error}</p>
  </div>);
}
