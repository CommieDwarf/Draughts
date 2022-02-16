import React from "react";
import { IChessboard } from "../../engine";

interface Props {
    contextMenu: {
      piece: string;
      queen: boolean;
      i: number;
      clientX: number;
      clientY: number;
      showMenu: boolean;
    };
    hide: () => void;
    chessboard: IChessboard;
}

export default class ContextMenu extends React.Component<Props> {
  ctxMenuRef: React.RefObject<HTMLDivElement>;
  
  constructor(props: any) {
    super(props);
    this.state = {};
    this.ctxMenuRef = React.createRef();
  }

  onClickTopHandler = () => {
    let props = this.props;
    if (props.contextMenu.queen) {
      props.chessboard[props.contextMenu.i]["queen"] = false;
    } else if (props.contextMenu.piece) {
      props.chessboard[props.contextMenu.i]["queen"] = true;
    } else {
      props.chessboard[props.contextMenu.i]["piece"] = "black";
    }
    document.dispatchEvent(new Event("chessboardChanged"));
  };

  onClickBotHandler = () => {
    let props = this.props;
    if (props.contextMenu.queen) {
      props.chessboard[props.contextMenu.i]["piece"] = "";
      props.chessboard[props.contextMenu.i]["queen"] = false;
    } else if (props.contextMenu.piece) {
      props.chessboard[props.contextMenu.i]["piece"] = "";
    } else {
      props.chessboard[props.contextMenu.i]["piece"] = "white";
    }
    document.dispatchEvent(new Event("chessboardChanged"));
  };

  setCordAttributes() {
    let contextMenu = this.ctxMenuRef.current;

    if (contextMenu) {
      let attribute = "left: " + this.props.contextMenu.clientX + "px; ";
      attribute += "top: " + this.props.contextMenu.clientY + "px; ";
      contextMenu.setAttribute("style", attribute);
    }
  }

  handleOutsideClick = (event: MouseEvent) => {
    let target = event.target as HTMLElement;
    if (
      target &&
      this.ctxMenuRef.current &&
      !target.contains(this.ctxMenuRef.current)
    ) {
      this.props.hide();
    }
  };

  componentDidMount() {
    this.setCordAttributes();
    let container = document.querySelector(".container") as HTMLElement;
    if (container) {
      container.addEventListener("click", this.handleOutsideClick);
    }
  }

  componentDidUpdate() {
    this.setCordAttributes();
    let container = document.querySelector(".container") as HTMLElement;
    if (container) {
      container.removeEventListener("click", this.handleOutsideClick);
    }
  }

  render() {
    let props = this.props;

    let label1;
    let label2;

    if (props.contextMenu.queen) {
      label1 = "queen";
      label2 = "remove";
    } else if (props.contextMenu.piece) {
      label1 = "queen";
      label2 = "remove";
    } else {
      label1 = "black";
      label2 = "white";
    }

    return (
      <div className={"context-menu"} ref={this.ctxMenuRef}>
        <div className="context-menu__label" onClick={this.onClickTopHandler}>
          {label1}
        </div>
        <hr className="context-menu__break-line" />
        <div className="context-menu__label" onClick={this.onClickBotHandler}>
          {label2}
        </div>
        <br></br>
      </div>
    );
  }
}
