import React from "react";

import { getPieceJSX } from "./getPieceJSX";

import { Type } from "./getPieceJSX";
type Color = "black" | "white" | "";

interface Props {
  color: Color;
    type: Type;
    queen: boolean;
    id: string;
}

export default class Piece extends React.Component<Props> {
 
  constructor(props: any) {
    super(props);
  }

  render() {
    let piece = getPieceJSX(
      this.props.color,
      this.props.type,
      this.props.queen
    );
    return piece;
  }
}
