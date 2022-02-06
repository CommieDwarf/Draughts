import React from 'react';


type Props = {
    gameId: string,
    author: string,
}

export default function GameInvitation(props: Props) {
    return <>
        <div className="lobby__game-invitation-text">
            {props.author} is challenging you
        </div>
        <div className="lobby__acceptButton">
            Accept
        </div>

    </>;
}
