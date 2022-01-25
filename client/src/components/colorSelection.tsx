import React from "react";
import { SIDE } from "../config";
import { GAMEMODE } from "../game";


type Color = "black" | "white";

export default class ColorSelection extends React.Component {

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    props: {
        startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color) => boolean;
        visibility: "game-menu__color--visible" | "game-menu__color--hidden";
    }

  

    onClickHandler = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        
        let color: Color;
        let side: SIDE;
        if (target.closest("#choose-white")) {
            color = "white";
            side = SIDE.NORMAL;
        } else {
            color = "black";
            side = SIDE.REVERSED
        }
        this.props.startNewGame(GAMEMODE.BOT, side, color);

    }

    render() {
        const {visibility} = this.props;
        return (
            <div className="game-menu__color-selection">
                <div className={"game-menu__color " + visibility} onClick={this.onClickHandler}>
                    Play white
                </div>
                <div className={"game-menu__color " + visibility} onClick={this.onClickHandler}>
                    Play black
                </div>
            </div>
        )
    }
}