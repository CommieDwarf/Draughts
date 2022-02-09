import React from 'react';
import Game from '../../game';
import { socket } from '../../main';


type Props = {
    gameCounter: number,
    closeGame?: (GameCounter: number, gameId?: string) => void;
    game: Game;
}

export default function CloseGame(props: Props) {

    function handleClick() {
        if (props.closeGame) {
            if (!props.game.id) {
                props.closeGame(props.gameCounter);

            } else {
                props.closeGame(0, props.game.id);
                socket.emit("player-close-game", props.game.id)
            }
        }
    }

    return (
        <div className="game-preview__close-game" onClick={handleClick}>
            <i className="icon-cancel-circled"></i>
        </div>
    )
}
