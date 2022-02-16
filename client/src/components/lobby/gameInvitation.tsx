import React from "react";

interface Props {
  gameId: number;
  author: string;
  target: string;
  roomId: string;
  acceptChallange: (name: string, gameId: number, roomId: string) => void;
};

export default function GameInvitation(props: Props) {
  function handleClick() {
    props.acceptChallange(props.author, props.gameId, props.roomId);
  }

  return (
    <>
      <div className="lobby__game-invitation-text">
        {props.author} is challenging you
      </div>
      <div className="lobby__acceptButton" onClick={handleClick}>
        Accept
      </div>
    </>
  );
}
