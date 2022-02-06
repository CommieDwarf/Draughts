import React, { MouseEvent, Ref } from "react";
import Chat from "./chat";
import { socket } from "../../main";
import Players from "./players";
import Room from "./room";
import { GAMEMODE } from "../../game";
import { SIDE } from "../../config";
import GameInviation from "./gameInvitation"


export interface IPlayer {
    name: string,
    avatar: {
        theme: string,
        shape: string,
    },
    id: string,
}

type Room = {
    name: string,
    id: string,
    unread: boolean,
    hover: boolean,
    isWriting: boolean,
}

type Color = "white" | "black";

type Props = {

}
type State = {
    players: IPlayer[],
    rooms: Room[],
    currentRoom: Room,
    roomInvitable: boolean,
    gameInvitable: boolean,
    gameInvitations: {gameId: string, author: string}[]
}

export default class Lobby extends React.Component<Props, State> {

    props: {
        name: string,
        startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color, label: string) => boolean;
    }
    playersRef: React.RefObject<HTMLDivElement>
    createRoomRef: React.RefObject<HTMLDivElement>
    inviteRef: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            players: [],
            currentRoom: {name: "global room", id: "global", unread: false, hover: false, isWriting: false},
            rooms: [{name: "global room", id: "global", unread: false, hover: false, isWriting: false}],
            roomInvitable: false,
            gameInvitable: false,
            gameInvitations: [],
        }
        this.playersRef = React.createRef();
        this.createRoomRef = React.createRef();
        this.inviteRef = React.createRef();
    }

    handleClickInvite = () => {
        this.setState({gameInvitable: true});
        console.log('invite');
    }

    getGameId(playerName1: string, playerName2: string) {
        if (playerName1 > playerName2) {
            return playerName1 + playerName2 + "-game";
        }  else {
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

    createRoom = (name: string) => {
        let roomId = this.getRoomId(name);
        if (!this.state.rooms.some((room) => room.name == name) && name !== this.props.name) {
            const room = {author: this.props.name, target: name, id: roomId }
            socket.emit("join_room", room);
            socket.emit("create_room", room);
            this.setState(prevState => {
                const room = {name, id: roomId, unread: false, hover: false, isWriting: false}
                return {
                    rooms: [...prevState.rooms, room],
                    currentRoom: room,
                    roomInvitable: false,
                }
            });
        }
    }

    closeRoom = (name: string) => {
        this.setState((prevState) => {
            return {
                rooms: prevState.rooms.filter((room) => room.name != name)
            }
        })
    }

   

    handlePlayerInvite = (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;
        const player = target.closest(".lobby__player")
        
     
        if (player && !this.state.rooms.some((room) => {room.name == player.id}) && this.state.roomInvitable) {
            this.createRoom(player.id);
        }
        if (player && this.state.gameInvitable) {
            socket.emit("request_join_game", this.props.name);
            socket.emit("join_game", this.getGameId(player.id, this.props.name));
        }
        
    }

    handleClickNewRoom = () => {
        this.setState({ roomInvitable: true });
    }

    handleOutsidePlayersClick = (event: any) => {
        const { target } = event
        if (!this.playersRef.current?.contains(target) ) {
            if (!this.createRoomRef.current?.contains(target)) {
                this.setState({ roomInvitable: false });
            }
            if (!this.inviteRef.current?.contains(target)) {
                this.setState({ gameInvitable: false });
            }

        }
    }

    switchRoom = (room: Room) => {
        if (room.id !== "global") {
            this.setState({currentRoom: room})
        } else {
            this.setState(prevState => {
                return {
                    currentRoom: prevState.rooms[0]
                }
            })
        }
        this.setRoomProperty(room.id, "unread", false);
    }

    

    setRoomProperty = (id: string, propertyName: string, propertyValue: any) => {
        const rooms = this.state.rooms.filter((room) => room.id == id);
        const room = rooms[0];
        if (room instanceof Object && room) {
            Object.defineProperty(room, propertyName, {value: propertyValue});
            const index = this.state.rooms.findIndex((room) => room.id == id);
            this.setState(prevState => {
                return {
                    rooms: [...prevState.rooms.slice(0, index), room, ...prevState.rooms.slice(index + 1, prevState.rooms.length)],
                }
            })
            if (room.id == this.state.currentRoom.id) {
                this.setState({currentRoom: room})
            }
        }
    }
    
    componentDidMount = () => {
        socket.on("players_update", (players) => {
            this.setState({ players })
        })
        socket.on("room_created", (room) => {
            if (this.props.name == room.target) {
                socket.emit("join_room", room);
               console.log(room);
            }
        })
  
        socket.on("someone_writing", (room) => {
            this.setRoomProperty(room.id, 'isWriting', true);
        })
        socket.on("done_writing", (room) => {
            this.setRoomProperty(room.id, 'isWriting', false);
        })

        socket.on("requested_join_game", (author) => {
            const gameId = this.getGameId(author, this.props.name);
            socket.emit("join_game", (gameId))
            this.setState((prevState) => {
                return {
                    gameInvitations: [...prevState.gameInvitations, {author, gameId}]
                }
            })
        })

        socket.on("player_disconected", (player) => {
            this.setState((prevState) => {
                
            })
        })

        document.addEventListener('click', this.handleOutsidePlayersClick);

    }


    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsidePlayersClick);
        socket.off();
    }

    render() {

        const player = this.state.players.find((player) => player.name == this.props.name)

        let rooms = this.state.rooms.map((room, id) => {
            return <Room closeRoom={this.closeRoom}
            setRoomProperty={this.setRoomProperty}
            switchRoom={this.switchRoom}
            room={room}
            currentRoom={this.state.currentRoom}
            key={id}
            />
        })

        const gameInvitations = this.state.gameInvitations.map((inv, i) => {
            return <GameInviation author={inv.author} gameId={inv.gameId} key={i}/>
        })

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
                
                <div className={"lobby__invite-button no-select " + inviteClass} ref={this.inviteRef} 
                onClick={this.handleClickInvite}>
                    Invite
                </div>
                <div className="lobby__game-invitation">
                    {gameInvitations}
                </div>
                <div className="lobby__players" ref={this.playersRef}>
                    <Players players={this.state.players}
                        roomInvitable={this.state.roomInvitable}
                        gameInvitable={this.state.gameInvitable}
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
                {player && <Chat player={player}
                currentRoom={this.state.currentRoom}
                createRoom={this.createRoom}
                rooms={this.state.rooms}
                setRoomProperty={this.setRoomProperty} isWriting={this.state.currentRoom.isWriting}                  />}
            </div>
        )
    }
}