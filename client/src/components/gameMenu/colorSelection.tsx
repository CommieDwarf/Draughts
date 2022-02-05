import React from "react";
import { SIDE } from "../../config";
import { GAMEMODE } from "../../game";
type Color = "black" | "white";

type Props = {
    color: "white" | "black";
    gameMode: GAMEMODE;
    startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string) => boolean;
    label: string;
}

export default function ColorSelection(props: Props) {

    let side = props.color == "white" ? SIDE.NORMAL : SIDE.REVERSED;

    function handleClick() {
        props.startNewGame(props.gameMode, side, props.color, props.label)
    }

    return (
        <div className={"game-menu__color"} onClick={handleClick}>
            {props.color}
        </div>
    )
}
