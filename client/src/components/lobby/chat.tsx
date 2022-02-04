import React from "react";
import Message from "./message";
import { IPlayer } from "./lobby";
import { socket } from "../../main";
import Emojis  from "./emojis";


type IMessage = {
    content: string,
    author: IPlayer,
    room: {
        id: string,
        name: string,
    },
}

type Room = {
    name: string,
    id: string,
    unread: boolean,
    hover: boolean,
    isWriting: boolean,
}


type Props = {};
type State = {
    messages: IMessage[],
    message: string,
    showEmojis: boolean,
}

export default class Chat extends React.Component<Props, State> {

    props: {
        player: IPlayer;
        currentRoom: Room,
        createRoom: (name: string) => void;
        rooms: Room[],
        isWriting: boolean,
        setRoomProperty: (id: string, propertyName: string, propertyValue: any) => void;
    }

    thisPlayerId: string

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            messages: [],
            message: "",
            showEmojis: false,
        }
        this.thisPlayerId = socket.id;
    }

    scrollToBot() {
        const msgsDiv = document.getElementById('messages');
            if (msgsDiv) {
                msgsDiv.scrollBy({top: msgsDiv.scrollHeight + 9999});
            }
    }

    sendMesage = () => {
        if (this.state.message.replace(/\s/g, '').length) {
            socket.emit("done_writing", this.props.currentRoom);
            const message = {content: this.state.message, author: this.props.player, room: this.props.currentRoom}
            socket.emit("send_message", message);
            this.setState((prev) => {
                return {
                    messages: [...prev.messages, {content: this.state.message, author: this.props.player, room: this.props.currentRoom}],
                    message: "",
                }
            })
            this.scrollToBot();            
        }
        document.getElementById("input")?.focus();
    }

    receiveMessage(message: IMessage) {
        console.log(message);
        console.log(message.room, this.props.rooms);
        if (!this.props.rooms.some((room) => room.id == message.room.id)) {
            this.props.createRoom(message.author.name);
        }
        if (message.room.id !== this.props.currentRoom.id) {
            this.props.setRoomProperty(message.room.id, "unread", true);
        }
        this.setState((prevState) => {
            return {
                messages: [...prevState.messages, message]
            }
        })
        this.scrollToBot();
    }

    onChangeHandler = (event: any) => {
        const target = event.target as HTMLInputElement;
        this.setState({message: target.value});
        socket.emit("writing", this.props.currentRoom)
        setTimeout(() => {
            socket.emit("done_writing", this.props.currentRoom)
        }, 4000)
    }

    handleEnter = (event: KeyboardEvent) => {
        if (event.key == "Enter") {
            this.sendMesage()
        }
    }

    toggleEmojis = () => {
        if (this.state.showEmojis) {
            this.setState({showEmojis: false})
        } else {
            this.setState({showEmojis: true});
        }
    }

    pickEmoji = (emoji: string) => {
        this.setState((prevState) => {
            return {
                message: prevState.message + " " + emoji + " "
            }
        });
    }
    
    handleOutsideClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (!target.closest('.lobby__emoji-container') && !target.closest(".lobby__emo-button")) {
            this.setState({showEmojis: false})
        }
    }

    setEmojiBottom() {
        const emoContainer = document.getElementById('emoji-container');
        const msgsDiv = document.getElementById('messages');
        if (emoContainer && msgsDiv) {
            emoContainer.setAttribute("style", "top: " + (msgsDiv.scrollHeight - 85) + "px");

        }
    }



    componentDidMount() {
        socket.on("get_message", (msg) => {
            this.receiveMessage(msg);
        })
        document.addEventListener("keydown", this.handleEnter);
        document.addEventListener("click", this.handleOutsideClick)
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleEnter);
        socket.off()
        document.removeEventListener("click", this.handleOutsideClick)
    }

    componentDidUpdate() {
        this.scrollToBot();
        this.setEmojiBottom();
    }

    render() {
        let messages = this.state.messages.map((msg, id) =>  {
            if (msg.room.id == this.props.currentRoom.id) {
                return (
                <Message author={msg.author}
                 content={msg.content} key={id}
                  thisPlayerId={this.thisPlayerId}/>
                  )
            }
        })


        const emoButtonClass = this.state.showEmojis ? "white color-black" : "";

        return (
            <div className="lobby__chat">
                    <div className="lobby__messages">
                        {messages}
                        {this.props.isWriting && <div className="lobby__someone-writing">
                            Someone is writing
                            <div className="lobby__dot-wrapper lobby__dot-wrapper--1">
                                <div id="dot-1" className="lobby__dot"></div>
                            </div>
                            <div id="dot-wrapper-2" className="lobby__dot-wrapper">
                                <div id="dot-2" className="lobby__dot"></div>
                            </div>
                            <div id="dot-wrapper-3" className="lobby__dot-wrapper">
                                <div id="dot-3" className="lobby__dot"></div>
                            </div>
                        </div>}
                        {this.state.showEmojis && <Emojis pickEmoji={this.pickEmoji}/>}
                    </div>
                        <input className="lobby__input" 
                        type="text"
                         onChange={this.onChangeHandler}
                          value={this.state.message}
                          autoComplete="off">
                        </input>
                    
                    <div className={"lobby__emo-button no-select " + emoButtonClass} onClick={this.toggleEmojis}>
                        <i className="icon-emo-happy"></i>
                    </div>
                    <div className="lobby__send-button no-select" onClick={this.sendMesage}>
                    <i className="icon-right-open-outline"></i>
                    </div>
                </div>
        )
    }
}