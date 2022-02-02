import React, { MouseEvent, Ref } from "react";
import Chat from "./chat";
import { socket } from "../../main";
import Players from "./players";



export interface IPlayer {
    name: string,
    avatar: {
        theme: string,
        shape: string,
    },
    id: string,
}

type Props = {

}
type State = {
    players: IPlayer[],
    rooms: {
        name: string,
        id: string
    }[],
    currentRoom: {
        name: string,
        id: string
    },
    roomInvitable: boolean,
}


export default class Lobby extends React.Component<Props, State> {

    props: {
        name: string,
    }
    playersRef: React.RefObject<HTMLDivElement>
    createRoomRef: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            players: [],
            rooms: [{name: "global room", id: "global"}],
            currentRoom: {name: "global room", id: "global"},
            roomInvitable: false,
        }
        this.playersRef = React.createRef();
        this.createRoomRef = React.createRef();
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

    createRoom = (name: string) => {
        let roomId = this.getRoomId(name);
        if (!this.state.rooms.some((room) => room.name == name) && name !== this.props.name) {
            socket.emit("join_room", {name, id: roomId});
            this.setState(prevState => {
                return {
                    rooms: [...prevState.rooms, {name, id: roomId}],
                    currentRoom: {name, id: roomId},
                    roomInvitable: false,
                }
            });
        }
    }

    handlePlayerInvite = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        const player = target.closest(".lobby__player")
        
     
        if (player && !this.state.rooms.some((room) => {room.name == player.id}) && this.state.roomInvitable) {
            this.createRoom(player.id);
        }
    }

    handleClickNewRoom = () => {
        this.setState({ roomInvitable: true });
    }

    handleOutsidePlayersClick = (event: any) => {
        const { target } = event
        if (!this.playersRef.current?.contains(target) && !this.createRoomRef.current?.contains(target)) {
            this.setState({ roomInvitable: false });
        }
    }

    switchRoomHandler = (event: React.MouseEvent<HTMLDivElement>) => {
        const target = event.target as HTMLDivElement;
        const room = target.closest(".lobby__room");
        const id = room?.id;
        const name = room?.textContent;
        if (name && id && id !== "global") {
            this.setState({currentRoom: {name, id: this.getRoomId(name)}})
        } else {
            this.setState({currentRoom: {name: "global room", id: "global"}})
        }
    }

    componentDidMount = () => {
        socket.on("players_update", (players) => {
            this.setState({ players })
        })
        socket.on("get_room", (socket) => {
            if (this.props.name == socket.target) {
                this.createRoom(socket.author)
            }
        })
        document.addEventListener('click', this.handleOutsidePlayersClick);

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsidePlayersClick);
        socket.off("players_update");
        socket.off("get_room")
    }

    render() {

        const player = this.state.players.find((player) => player.name == this.props.name)

        let rooms = this.state.rooms.map((room, id) => {
            let roomClass = "";
            if (room.name == this.state.currentRoom.name) {
                roomClass = "lobby__room--current";
            }
            return <div className={"lobby__room no-select " + roomClass} id={room.id} key={id} onClick={this.switchRoomHandler}>{room.name}</div>
        })

        let newRoomButtonClass = "";
        if (this.state.roomInvitable) {
            newRoomButtonClass = "lobby__new-room-button--green";
        }

        return (
            <div className="lobby">
                <div className="lobby__invite-button">
                    Invite
                </div>
                <div className="lobby__players" ref={this.playersRef}>
                    <Players players={this.state.players}
                        invitable={this.state.roomInvitable}
                        handlePlayerInvite={this.handlePlayerInvite}
                        rooms={this.state.rooms}
                    />;
                </div>
                <div className="lobby__rooms">
                    {rooms}
                    <div
                        className={"lobby__new-room-button no-select " + newRoomButtonClass}
                        onClick={this.handleClickNewRoom} ref={this.createRoomRef}>
                        <i className="icon-user-plus"></i>
                    </div>
                </div>
                {player && <Chat player={player} currentRoom={this.state.currentRoom} />}
            </div>
        )
    }
}