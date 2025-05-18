import React from "react";
import Piece from "./Piece";
import { Type } from "./getPieceJSX";

interface Props {
  pieceColor: "white" | "black" | "";
    id: string;
    className: string;
    type: Type;
    queen: boolean;
}

export default class Square extends React.Component<Props> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div id={this.props.id} className={this.props.className}>
        <Piece
          color={this.props.pieceColor}
          id={this.props.id}
          type={this.props.type}
          queen={this.props.queen}
        />
      </div>
    );
  }
}
