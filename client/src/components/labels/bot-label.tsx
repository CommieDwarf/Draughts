import React from "react";

export default class BotLabel extends React.Component {
  render() {
    return (
        <div className="board__bot-label no-select">
            <div className="board__bot-label-letter">A
            </div>
            <div className="board__bot-label-letter">B
            </div>
            <div  className="board__bot-label-letter">C
            </div>
            <div  className="board__bot-label-letter">D
            </div>
            <div  className="board__bot-label-letter">E
            </div>
            <div  className="board__bot-label-letter">F
            </div>
            <div  className="board__bot-label-letter">G
            </div>
            <div  className="bot-letter">H
            </div>
      </div>
    );
  }
}
