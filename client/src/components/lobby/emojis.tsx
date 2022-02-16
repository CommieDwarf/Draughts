import React, { Component } from "react";

const path = "./img/emojis/";
import emojiList from "./emojiList";

export { path, emojiList };

interface Props {
  pickEmoji: (emoji: string) => void;
  emoContainerDivRef: React.RefObject<HTMLDivElement>;
}

export default class Emojis extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  onClickHandler = (event: React.MouseEvent) => {
    const target = event.target as HTMLImageElement;
    const emoji = target.alt;
    this.props.pickEmoji(emoji);
  };

  render() {
    const imgs = emojiList.map((emoji, id) => (
      <img
        className="lobby__emoji"
        key={id}
        src={path + emoji + ".png"}
        alt={emoji}
        onClick={this.onClickHandler}
      ></img>
    ));

    return (
      <div
        className="lobby__emoji-container"
        ref={this.props.emoContainerDivRef}
      >
        {imgs}
      </div>
    );
  }
}
