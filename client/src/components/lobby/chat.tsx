import React from "react";
import Message from "./Message";
import { IPlayer } from "./Lobby";
import { socket } from "../../main";
import Emojis from "./Emojis";

interface IMessage {
  content: string;
  author: IPlayer;
  room: {
    id: string;
    name: string;
  };
};

interface Room  {
  name: string;
  id: string;
  unread: boolean;
  hover: boolean;
  isWriting: boolean;
};

interface Props {
  player: IPlayer;
    currentRoom: Room;
    createRoom: (name: string) => void;
    rooms: Room[];
    isWriting: boolean;
    setRoomProperty: (
      id: string,
      propertyName: string,
      propertyValue: any
    ) => void;
};
interface State {
  messages: IMessage[];
  message: string;
  showEmojis: boolean;
};

export default class Chat extends React.Component<Props, State> {

  thisPlayerId: string;
  messagesDivRef: React.RefObject<HTMLDivElement>;
  emoContainerDivRef: React.RefObject<HTMLDivElement>;

  constructor(props: Props) {
    super(props);
    this.state = {
      messages: [],
      message: "",
      showEmojis: false,
    };
    this.thisPlayerId = socket.id;
    this.messagesDivRef = React.createRef();
    this.emoContainerDivRef = React.createRef();
  }

  scrollToBot() {
    if (this.messagesDivRef.current) {
      this.messagesDivRef.current.scrollBy({
        top: this.messagesDivRef.current.scrollHeight + 9999,
      });
    }
  }

  sendMesage = () => {
    if (this.state.message.replace(/\s/g, "").length) {
      socket.emit("done_writing", this.props.currentRoom);
      const message = {
        content: this.state.message,
        author: this.props.player,
        room: this.props.currentRoom,
      };
      socket.emit("send_message", message);
      this.setState((prev) => {
        return {
          messages: [
            ...prev.messages,
            {
              content: this.state.message,
              author: this.props.player,
              room: this.props.currentRoom,
            },
          ],
          message: "",
        };
      });
      this.scrollToBot();
    }
    document.getElementById("input")?.focus();
  };

  receiveMessage(message: IMessage) {
    if (!this.props.rooms.some((room) => room.id == message.room.id)) {
      this.props.createRoom(message.author.name);
    }
    if (message.room.id !== this.props.currentRoom.id) {
      this.props.setRoomProperty(message.room.id, "unread", true);
    }
    this.setState((prevState) => {
      return {
        messages: [...prevState.messages, message],
      };
    });
    this.scrollToBot();
  }

  onChangeHandler = (event: any) => {
    const target = event.target as HTMLInputElement;
    this.setState({ message: target.value });
    socket.emit("writing", this.props.currentRoom);
    setTimeout(() => {
      socket.emit("done_writing", this.props.currentRoom);
    }, 4000);
  };

  handleEnter = (event: KeyboardEvent) => {
    if (event.key == "Enter") {
      this.sendMesage();
    }
  };

  toggleEmojis = () => {
    if (this.state.showEmojis) {
      this.setState({ showEmojis: false });
    } else {
      this.setState({ showEmojis: true });
    }
  };

  pickEmoji = (emoji: string) => {
    this.setState((prevState) => {
      return {
        message: prevState.message + " " + emoji + " ",
      };
    });
  };

  handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (
      !target.closest(".lobby__emoji-container") &&
      !target.closest(".lobby__emo-button")
    ) {
      this.setState({ showEmojis: false });
    }
  };

  setEmojiBottom() {
    if (this.emoContainerDivRef.current && this.messagesDivRef.current) {
      this.emoContainerDivRef.current.setAttribute(
        "style",
        "top: " + (this.messagesDivRef.current.scrollHeight - 85) + "px"
      );
      console.log("to bottom");
    }
  }

  componentDidMount() {
    socket.on("get_message", (msg) => {
      this.receiveMessage(msg);
    });
    document.addEventListener("keydown", this.handleEnter);
    document.addEventListener("click", this.handleOutsideClick);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleEnter);
    socket.off();
    document.removeEventListener("click", this.handleOutsideClick);
  }

  componentDidUpdate() {
    this.scrollToBot();
    this.setEmojiBottom();
  }

  render() {
    let messages = this.state.messages.map((msg, id) => {
      if (msg.room.id == this.props.currentRoom.id) {
        return (
          <Message
            author={msg.author}
            content={msg.content}
            key={id}
            thisPlayerId={this.thisPlayerId}
          />
        );
      }
    });

    const emoButtonClass = this.state.showEmojis ? "white color-black" : "";

    return (
      <div className="lobby__chat">
        <div className="lobby__messages" ref={this.messagesDivRef}>
          {messages}
          {this.props.isWriting && (
            <div className="lobby__someone-writing">
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
            </div>
          )}
          {this.state.showEmojis && (
            <Emojis
              pickEmoji={this.pickEmoji}
              emoContainerDivRef={this.emoContainerDivRef}
            />
          )}
        </div>
        <input
          className="lobby__input"
          type="text"
          onChange={this.onChangeHandler}
          value={this.state.message}
          autoComplete="off"
        ></input>

        <div
          className={"lobby__emo-button no-select " + emoButtonClass}
          onClick={this.toggleEmojis}
        >
          <i className="icon-emo-happy"></i>
        </div>
        <div className="lobby__send-button no-select" onClick={this.sendMesage}>
          <i className="icon-right-open-outline"></i>
        </div>
      </div>
    );
  }
}
