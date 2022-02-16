import React from 'react';
import { SIDE } from '../../config';
import Game, { GAMEMODE } from '../../game';
import StartGame from "./StartGame";

type Color = "black" | "white";

interface Props {
    startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string, id: number) => boolean;
    error: string,
    centered: boolean;
    games: Game[];
}

export default function gameMenu(props: Props) {

    let centerClass = props.centered ? "game-menu--center" : "";
    return (
        <div className={"game-menu no-select " + centerClass}>
            <div>
                <StartGame title="Start Local Game" 
                gameMode={GAMEMODE.LOCAL} startNewGame={props.startNewGame}
                label={"local"} games={props.games}
                />
                <StartGame title="Start Vs Computer Game"
                 gameMode={GAMEMODE.BOT} startNewGame={props.startNewGame}
                 label={"vsComp"} games={props.games}
                 />
            </div>
            
        </div>
    )
}








