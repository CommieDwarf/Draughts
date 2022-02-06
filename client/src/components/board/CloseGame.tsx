import React from 'react';


type Props = {
    gameCounter: number,
    closeGame?: (GameCounter: number) => void;
}

export default function CloseGame(props: Props) {

    function handleClick() {
        if (props.closeGame) {
            props.closeGame(props.gameCounter);
            console.log(props.gameCounter);
        }
    }

    return (
        <div className="game-preview__close-game" onClick={handleClick}>
            <i className="icon-cancel-circled"></i>
        </div>
    )
}
