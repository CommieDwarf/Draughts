import React, { MouseEvent, Ref } from "react";
import Chat from "./chat";
import { socket } from "../../main";
import Players from "./players";
import Room from "./room";
import { GAMEMODE } from "../../game";
import { SIDE } from "../../config";
import GameInviation from "./gameInvitation";
import GameInvSent from "./GameInvSent";

export interface IPlayer {
  name: string;
  avatar: {
    theme: string;
    shape: string;
  };
  id: string;
}

type Room = {
  name: string;
  id: string;
  unread: boolean;
  hover: boolean;
  isWriting: boolean;
};

type GameInfo = {
  gameId: number;
  playerAccepted: string;
  playerAcceptedColor: string;
  roomId: string;
};

type Color = "white" | "black";

type Props = {};
type State = {
  players: IPlayer[];
  rooms: Room[];
  currentRoom: Room;
  roomInvitable: boolean;
  gameInvitable: boolean;
  gameInvitations: {
    gameId: number;
    author: string;
    target: string;
    roomId: string;
  }[];
  gameInvSent: {
    gameId: number;
    author: string;
    target: string;
    roomId: string;
  }[];
};

export default class Lobby extends React.Component<Props, State> {
  props: {
    name: string;
    startNewGame: (
      gameMode: GAMEMODE,
      side: SIDE,
      color: Color,
      label: string,
      gameId: number,
      roomId: string
    ) => boolean;
  };
  playersRef: React.RefObject<HTMLDivElement>;
  createRoomRef: React.RefObject<HTMLDivElement>;
  inviteRef: React.RefObject<HTMLDivElement>;
  roomsRef: React.RefObject<HTMLDivElement>;

  constructor(props: any) {
    super(props);
    this.props = props;
    this.state = {
      players: [],
      currentRoom: {
        name: "global room",
        id: "global",
        unread: false,
        hover: false,
        isWriting: false,
      },
      rooms: [
        {
          name: "global room",
          id: "global",
          unread: false,
          hover: false,
          isWriting: false,
        },
      ],
      roomInvitable: false,
      gameInvitable: false,
      gameInvitations: [],
      gameInvSent: [],
    };
    this.playersRef = React.createRef();
    this.createRoomRef = React.createRef();
    this.inviteRef = React.createRef();
    this.roomsRef = React.createRef();
  }

  handleClickInvite = () => {
    this.setState({ gameInvitable: true });
  };

  getGameRoomId(playerName1: string, playerName2: string) {
    if (playerName1 > playerName2) {
      return playerName1 + playerName2 + "-game";
    } else {
      return playerName2 + playerName1 + "-game";
    }
  }

  getRoomId(name: string) {
    let roomIdPart1;
    let roomIdPart2;
    if (name > this.props.name) {
      roomIdPart1 = name;
      roomIdPart2 = this.props.name;
    } else {
      roomIdPart1 = this.props.name;
      roomIdPart2 = name;
    }
    return roomIdPart1 + roomIdPart2;
  }

  getGameId() {
    return Date.now();
  }

  createRoom = (name: string) => {
    let roomId = this.getRoomId(name);
    if (
      !this.state.rooms.some((room) => room.name == name) &&
      name !== this.props.name
    ) {
      const room = { author: this.props.name, target: name, id: roomId };
      socket.emit("join_room", room);
      socket.emit("create_room", room);
      this.setState((prevState) => {
        const room = {
          name,
          id: roomId,
          unread: false,
          hover: false,
          isWriting: false,
        };
        return {
          rooms: [...prevState.rooms, room],
          currentRoom: room,
          roomInvitable: false,
        };
      });
    }
  };

  closeRoom = (name: string) => {
    this.setState((prevState) => {
      return {
        rooms: prevState.rooms.filter((room) => room.name != name),
      };
    });
  };

  acceptChallange = (name: string, gameId: number, roomId: string) => {
    let randomNum = Math.floor(Math.random() * 2);
    let authorColor: Color;
    if (randomNum == 0) {
      authorColor = "white";
    } else {
      authorColor = "black";
    }
    let side = authorColor == "white" ? SIDE.NORMAL : SIDE.REVERSED;
    this.props.startNewGame(
      GAMEMODE.ONLINE,
      side,
      authorColor,
      name,
      gameId,
      roomId
    );
    let gameInfo = {
      roomId,
      gameId,
      playerAccepted: this.props.name,
      playerAcceptedColor: authorColor,
    };
    socket.emit("accept_challange", gameInfo);
    this.filterOutGameInvites(name);
  };

  filterOutGameInvites = (name: string) => {
    this.setState((prevState) => {
      return {
        gameInvitations: prevState.gameInvitations.filter(
          (inv) => inv.author != name
        ),
      };
    });
  };
  filterOutSentInvites = (name: string) => {
    this.setState((prevState) => {
      return {
        gameInvSent: prevState.gameInvSent.filter((inv) => inv.target != name),
      };
    });
  };

  handlePlayerInvite = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const player = target.closest(".lobby__player");

    if (
      player &&
      !this.state.rooms.some((room) => {
        room.name == player.id;
      }) &&
      this.state.roomInvitable
    ) {
      this.createRoom(player.id);
    }
    if (player && this.state.gameInvitable && player.id != this.props.name) {
      const gameRoomId = this.getGameRoomId(player.id, this.props.name);
      const gameId = this.getGameId();
      console.log(player.id);
      socket.emit("request_join_game", {
        author: this.props.name,
        target: player.id,
        gameId,
      });
      socket.emit("join_game", gameRoomId);
      this.setState({ gameInvitable: false });
      if (!this.state.gameInvSent.some((inv) => inv.target == player.id)) {
        const inv = {
          target: player.id,
          gameId,
          author: this.props.name,
          roomId: gameRoomId,
        };
        this.setState((prevState) => {
          return {
            gameInvSent: [...prevState.gameInvSent, inv],
          };
        });
      }
    }
  };

  handleClickNewRoom = () => {
    this.setState({ roomInvitable: true });
  };

  handleOutsidePlayersClick = (event: any) => {
    const { target } = event;
    if (!this.playersRef.current?.contains(target)) {
      if (!this.createRoomRef.current?.contains(target)) {
        this.setState({ roomInvitable: false });
      }
      if (!this.inviteRef.current?.contains(target)) {
        this.setState({ gameInvitable: false });
      }
    }
  };

  switchRoom = (room: Room) => {
    if (room.id !== "global") {
      this.setState({ currentRoom: room });
    } else {
      this.setState((prevState) => {
        return {
          currentRoom: prevState.rooms[0],
        };
      });
    }
    this.setRoomProperty(room.id, "unread", false);
  };

  setRoomProperty = (id: string, propertyName: string, propertyValue: any) => {
    const rooms = this.state.rooms.filter((room) => room.id == id);
    const room = rooms[0];
    if (room instanceof Object && room) {
      Object.defineProperty(room, propertyName, { value: propertyValue });
      const index = this.state.rooms.findIndex((room) => room.id == id);
      this.setState((prevState) => {
        return {
          rooms: [
            ...prevState.rooms.slice(0, index),
            room,
            ...prevState.rooms.slice(index + 1, prevState.rooms.length),
          ],
        };
      });
      if (room.id == this.state.currentRoom.id) {
        this.setState({ currentRoom: room });
      }
    }
  };

  handleScroll = (event: React.WheelEvent) => {
    if (event.deltaY < 0) {
      this.roomsRef.current?.scrollBy(-30, 0);
    } else if (event.deltaY > 0) {
      this.roomsRef.current?.scrollBy(30, 0);
    }
    return false;
  };

  componentDidMount = () => {
    socket.on("players_update", (players) => {
      this.setState({ players });
    });
    socket.on("room_created", (room) => {
      if (this.props.name == room.target) {
        socket.emit("join_room", room);
      }
    });

    socket.on("someone_writing", (room) => {
      this.setRoomProperty(room.id, "isWriting", true);
    });
    socket.on("done_writing", (room) => {
      this.setRoomProperty(room.id, "isWriting", false);
    });

    socket.on("requested_join_game", ({ author, gameId, target }) => {
      console.log(target);
      if (this.props.name == target) {
        const roomId = this.getGameRoomId(author, this.props.name);
        socket.emit("join_game", roomId);
        if (!this.state.gameInvitations.some((inv) => inv.gameId == gameId)) {
          this.setState((prevState) => {
            return {
              gameInvitations: [
                ...prevState.gameInvitations,
                { author, gameId, target: this.props.name, roomId },
              ],
            };
          });
        }
      }
    });

    socket.on("challange_accepted", (gameInfo: GameInfo) => {
      let color: Color;
      color = gameInfo.playerAcceptedColor == "white" ? "black" : "white";
      let side = color == "white" ? SIDE.NORMAL : SIDE.REVERSED;

      this.props.startNewGame(
        GAMEMODE.ONLINE,
        side,
        color,
        gameInfo.playerAccepted,
        gameInfo.gameId,
        gameInfo.roomId
      );
      this.filterOutSentInvites(gameInfo.playerAccepted);
    });

    socket.on("player_disconnected", (player) => {
      this.filterOutGameInvites(player.name);
      this.filterOutSentInvites(player.name);
    });

    document.addEventListener("click", this.handleOutsidePlayersClick);
  };

  componentWillUnmount() {
    document.removeEventListener("click", this.handleOutsidePlayersClick);
    socket.off();
  }

  render() {
    const player = this.state.players.find(
      (player) => player.name == this.props.name
    );

    let rooms = this.state.rooms.map((room, id) => {
      return (
        <Room
          closeRoom={this.closeRoom}
          setRoomProperty={this.setRoomProperty}
          switchRoom={this.switchRoom}
          room={room}
          currentRoom={this.state.currentRoom}
          key={id}
        />
      );
    });

    const gameInvitations = this.state.gameInvitations.map((inv, i) => {
      return (
        <GameInviation
          author={inv.author}
          gameId={inv.gameId}
          key={i}
          target={inv.target}
          acceptChallange={this.acceptChallange}
          roomId={inv.roomId}
        />
      );
    });

    const gameInvSent = this.state.gameInvSent.map((inv, i) => {
      return <GameInvSent target={inv.target} key={i} />;
    });

    let inviteClass = "";
    if (this.state.gameInvitable) {
      inviteClass = "lobby__invite-button--green";
    }

    let newRoomButtonClass = "";
    if (this.state.roomInvitable) {
      newRoomButtonClass = "lobby__new-room-button--green";
    }
    return (
      <div className="lobby">
        <div
          className={"lobby__invite-button no-select " + inviteClass}
          ref={this.inviteRef}
          onClick={this.handleClickInvite}
        >
          Invite
        </div>
        <div className="lobby__game-invitation">
          {gameInvitations}
          {gameInvSent}
        </div>
        <div className="lobby__players" ref={this.playersRef}>
          <Players
            players={this.state.players}
            roomInvitable={this.state.roomInvitable}
            gameInvitable={this.state.gameInvitable}
            handlePlayerInvite={this.handlePlayerInvite}
            rooms={this.state.rooms}
          />
          ;
        </div>
        <div
          className="lobby__rooms"
          ref={this.roomsRef}
          onWheel={this.handleScroll}
        >
          {rooms}
          <div
            className={"lobby__new-room-button no-select " + newRoomButtonClass}
            onClick={this.handleClickNewRoom}
            ref={this.createRoomRef}
          >
            <i className="icon-user-plus"></i>
          </div>
        </div>
        {player && (
          <Chat
            player={player}
            currentRoom={this.state.currentRoom}
            createRoom={this.createRoom}
            rooms={this.state.rooms}
            setRoomProperty={this.setRoomProperty}
            isWriting={this.state.currentRoom.isWriting}
          />
        )}
      </div>
    );
  }
}
