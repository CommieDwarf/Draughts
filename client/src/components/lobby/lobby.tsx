import React, { Ref } from "react";
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
    rooms: string[],
    currentRoom: string,
    canInvite: boolean,
}


export default class Lobby extends React.Component<Props, State> {

    props: {
        name: string,
        
    }
    playersRef: React.RefObject<HTMLDivElement>
    createRoomRef: React.RefObject<HTMLDivElement>
    avatar: any;
    name: any;
    id: any;

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            players: [],
            rooms: ["global room"],
            currentRoom: "global room",
            canInvite: false,
        }
        this.playersRef = React.createRef();
        this.createRoomRef = React.createRef();
    }

    createRoom = (name: string) => {
        if (!this.state.rooms.includes(name) && name !== this.props.name) {
            this.setState(prevState => {
                return {
                    rooms: [...prevState.rooms, name],
                    currentRoom: name,
                    canInvite: false,
                }
            });
        }
        let roomName = this.props.name + name;
    }

    handlePlayerInvite = (event: any) => {
        const target = event.target as HTMLElement;
        let player = target.closest(".player")

        if (this.state.canInvite && player) {
            this.createRoom(player.id);
            console.log(target.id)
        }
    }
    
    handleClickNewRoom =() => {
        this.setState({canInvite: true});
    }
    
    handleOutsidePlayersClick = (event: any) => {
        const {target} = event
        if (!this.playersRef.current?.contains(target) && !this.createRoomRef.current?.contains(target)) {
            this.setState({canInvite: false});
        }
        
    }

    componentDidMount = () => {
        socket.on("players_update", (players) => {
            this.setState({players})
        })
        document.addEventListener('click', this.handleOutsidePlayersClick);

    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsidePlayersClick);
        socket.off("players_update")
    }

    render() {
        

        const player = this.state.players.find((player) => player.name == this.props.name)

        let rooms = this.state.rooms.map((room, id) => {
            let roomClass = "";
            if (room == this.state.currentRoom) {
                roomClass = "green";
            }
            return <div className={"room no-select " + roomClass} id={room} key={id}>{room}</div>
        })

        let newRoomClass = "";
        if (this.state.canInvite) {
            newRoomClass = "green";
        }

        return (
            <div id="lobby">
                <div id="invite">
                    Invite
                </div>
                <div id="players" ref={this.playersRef}>
                    <Players players={this.state.players} 
                    canInvite={this.state.canInvite}
                    handlePlayerInvite={this.handlePlayerInvite}
                    />;
                </div>
                <div id="rooms">
                    {rooms}
                    <div id="new-room" 
                    className={"no-select " + newRoomClass} 
                    onClick={this.handleClickNewRoom} ref={this.createRoomRef}>
                        <i className="icon-user-plus"></i></div>
                </div>
                {player && <Chat player={player} currentRoom={this.state.currentRoom}/>}
            </div>
        )
    }
}