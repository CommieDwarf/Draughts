import React from 'react';


type Props = {
    gameId: string,
    author: string,
    target: string,
    acceptChallange: (name: string, gameId: string) => void;
}

export default function GameInvitation(props: Props) {

    function handleClick() {
        props.acceptChallange(props.author, props.gameId);
    }

    return <>
        <div className="lobby__game-invitation-text">
            {props.author} is challenging you
        </div>
        <div className="lobby__acceptButton" onClick={handleClick}>
            Accept
        </div>

    </>;
}
