import React from "react";

interface Room {
  name: string;
  id: string;
  unread: boolean;
  hover: boolean;
  isWriting: boolean;
};

interface Props {
  closeRoom: (name: string) => void;
  setRoomProperty: (id: string, prop: string, value: any) => void;
  switchRoom: (room: Room) => void;
  room: Room;
  currentRoom: {
    name: string;
    id: string;
  };
};

export default function Room(props: Props) {
  const room = props.room;

  const handleClickCloseRoom = (event: React.MouseEvent) => {
    props.closeRoom(room.name);
  };

  const handleMouseOver = (event: React.MouseEvent) => {
    roomMouseMove(event, true);
  };
  const handleMouseLeave = (event: React.MouseEvent) => {
    roomMouseMove(event, false);
  };
  const roomMouseMove = (event: React.MouseEvent, hover: boolean) => {
    const target = event.target as HTMLInputElement;
    const wrapper = target.closest(".lobby__room-wrapper");
    const children = wrapper?.children;
    if (children && children[0]) {
      props.setRoomProperty(props.room.id, "hover", hover);
    }
  };
  const handleClickRoom = (event: React.MouseEvent) => {
    props.switchRoom(props.room);
  };

  let roomClass = "";
  if (room.name == props.currentRoom.name) {
    roomClass = "lobby__room--current";
  }
  if (room.unread) {
    roomClass += " lobby__room--unread";
  }
  let closeRoomClass = "";
  if (room.hover) {
    closeRoomClass = "lobby__close-room--visible";
  } else {
    closeRoomClass = "lobby__close-room--hidden";
  }
  let globalRoomClass = "";

  if (props.room.name == "global room") {
    globalRoomClass = "lobby__room--global";
  }

  return (
    <div
      className="lobby__room-wrapper"
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={"lobby__room no-select " + roomClass + " " + globalRoomClass}
        onClick={handleClickRoom}
      >
        {room.name}
      </div>
      {room.id != "global" && (
        <div
          className={"lobby__close-room " + closeRoomClass}
          onClick={handleClickCloseRoom}
        >
          <i className="icon-cancel-circled"></i>
        </div>
      )}
    </div>
  );
}
