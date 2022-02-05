import React from 'react';
import { SIDE } from '../../config';
import { GAMEMODE } from '../../game';
import ColorSelection from "./colorSelection";

type Color = "black" | "white";

type Props = {
    title: string,
    gameMode: GAMEMODE,
    startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string) => boolean;
    label: string,
}

export default function StartGame(props: Props) {
  return (
  <div className="game-menu__start-game">
    <h3>{props.title}</h3>
    <ColorSelection color="white" gameMode={props.gameMode}
    startNewGame={props.startNewGame} label={props.label}/>
    <ColorSelection color="black" gameMode={props.gameMode}
     startNewGame={props.startNewGame} label={props.label}/>
    <p className="game-menu__error"></p>
  </div>);
}
