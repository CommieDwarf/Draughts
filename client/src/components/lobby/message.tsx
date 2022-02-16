import React, {ReactElement } from "react";
import Avatar from "./Avatar";

import { IPlayer } from "./Lobby";
import { path } from "./Emojis";
import emojiList from "./emojiList";

interface Props {
  author: IPlayer;
  content: string;
  thisPlayerId: string;
}

export default class Message extends React.Component<Props> {

  constructor(props: any) {
    super(props);
  }

  render() {
    const author = this.props.author;

    let text: string[] = this.props.content.split(" ");

    let message: ReactElement[] = [];

    for (let i = 0; i < text.length; i++) {
      if (emojiList.includes(text[i])) {
        message.push(
          <div className="lobby__emoji-wrapper">
            <img
              src={path + text[i] + ".png"}
              className="lobby__inline-emoji"
              key={i}
            ></img>
          </div>
        );
      } else {
        message.push(<span key={i}>{text[i] + " "}</span>);
      }
    }

    let msgAuthorClass = "";

    if (this.props.thisPlayerId == this.props.author.id) {
      msgAuthorClass = "lobby__author-name--current";
    }

    return (
      <div className="lobby__message">
        <div className="lobby__message-author">
          <div id="player1" className="lobby__message-author">
            <Avatar
              shape={author.avatar.shape}
              theme={author.avatar.theme}
              name={author.name}
              small={true}
            />
            <span className={"lobby__author-name " + msgAuthorClass}>
              {this.props.author.name}:
            </span>
          </div>
        </div>
        <div className={"lobby__message-content "}>{message}</div>
      </div>
    );
  }
}
