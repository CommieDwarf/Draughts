import React from 'react';


interface Props {
    target: string,
}

export default function GameInvitation(props: Props) {
    return <>
        <div className="lobby__game-invitation-text">
            You challanged {props.target}
        </div>
    </>;
}
