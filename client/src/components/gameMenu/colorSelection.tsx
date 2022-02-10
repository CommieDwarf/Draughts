import React, { Dispatch, SetStateAction} from "react";
import { SIDE } from "../../config";
import { GAMEMODE } from "../../game";
type Color = "black" | "white";

type Props = {
    color: "white" | "black";
    gameMode: GAMEMODE;
    startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string, id: number) => boolean;
    label: string;
    setError: Dispatch<SetStateAction<string>>;
}

export default function ColorSelection(props: Props) {

    let side = props.color == "white" ? SIDE.NORMAL : SIDE.REVERSED;

    
    function handleClick() {
        const id = Date.now();
        const isStarted = props.startNewGame(props.gameMode, side, props.color, props.label, id);
        if (isStarted) {
            props.setError("");
        } else {
            props.setError("Game quantity limit reached. Close some game");
        }
    }

    return (
        <div className={"game-menu__color"} onClick={handleClick}>
            {props.color}
        </div>
    )
}
