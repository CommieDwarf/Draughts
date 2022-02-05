import React from 'react';
import { SIDE } from '../../config';
import { GAMEMODE } from '../../game';
import StartGame from "./startGame";

type Color = "black" | "white";

type Props = {
    startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string) => boolean;
    centered: boolean;
}

export default function gameMenu(props: Props) {

    let centerClass = props.centered ? "game-menu--center" : "";
    return (
        <div className={"game-menu no-select " + centerClass}>
            <div>
                <StartGame title="Start Local Game" 
                gameMode={GAMEMODE.LOCAL} startNewGame={props.startNewGame}
                label={"local"}
                />
                <StartGame title="Start Vs Computer Game"
                 gameMode={GAMEMODE.BOT} startNewGame={props.startNewGame}
                 label={"vsComp"}
                 />
            </div>
            
        </div>
    )
}








