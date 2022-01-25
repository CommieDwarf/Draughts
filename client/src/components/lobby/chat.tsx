import React from "react";
import Message from "./message";
import { IPlayer } from "./lobby";
import { socket } from "../../main";
import Emojis  from "./emojis";


type IMessage = {
    content: string,
    author: IPlayer,
    room: string,
}

type Props = {};
type State = {
    messages: IMessage[],
    message: string,
    someoneWriting: boolean,
    showEmojis: boolean,
}

export default class Chat extends React.Component<Props, State> {

    props: {
        player: IPlayer;
        currentRoom: string
    }

    thisPlayerId: string

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            messages: [],
            message: "",
            someoneWriting: false,
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
            socket.emit("done_writing");
            socket.emit("send_message", {content: this.state.message, author: this.props.player, room: this.props.currentRoom});
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
        socket.emit("writing")
        setTimeout(() => {
            socket.emit("done_writing")
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
        if (!target.closest('#emoji-container') && !target.closest("#emo-button")) {
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
        document.addEventListener("keydown", this.handleEnter);

        socket.on("get_message", (message) => {
            this.receiveMessage(message);
        })
        socket.on("someone_writing", () => {
            this.setState({someoneWriting: true});
        })
        socket.on("done_writing", () => {
            this.setState({someoneWriting: false});
        })

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

        let messages = this.state.messages.map((msg, id) => {
            if (msg.room == this.props.currentRoom) {
                return (
                <Message author={msg.author}
                 content={msg.content} key={id}
                  thisPlayerId={this.thisPlayerId}/>
                  )

            }
        })

        

        const emoButtonClass = this.state.showEmojis ? "white color-black" : "";

        return (
            <div id="chat">
                    <div id="messages">
                        {messages}
                        {this.state.someoneWriting && <div id="someone-writing">
                            Someone is writing
                            <div id="dot-wrapper-1" className="dot-wrapper">
                                <div id="dot-1" className="dot"></div>
                            </div>
                            <div id="dot-wrapper-2" className="dot-wrapper">
                                <div id="dot-2" className="dot"></div>
                            </div>
                            <div id="dot-wrapper-3" className="dot-wrapper">
                                <div id="dot-3" className="dot"></div>
                            </div>
                        </div>}
                        {this.state.showEmojis && <Emojis pickEmoji={this.pickEmoji}/>}
                    </div>
                        <input id="input" 
                        type="text"
                         onChange={this.onChangeHandler}
                          value={this.state.message}
                          autoComplete="off">
                        </input>
                    
                    <div id="emo-button" className={"no-select " + emoButtonClass} onClick={this.toggleEmojis}>
                        <i className="icon-emo-happy"></i>
                    </div>
                    <div id="send-button" onClick={this.sendMesage} className="no-select">
                    <i className="icon-right-open-outline"></i>
                    </div>
                </div>
        )
    }
}