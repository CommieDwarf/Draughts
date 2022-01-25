import React from "react";

import {getPieceJSX} from './getPieceJSX';

import {Type} from "./getPieceJSX"
type Color = "black" | "white" | "";

export default class Piece extends React.Component {
  props: {
    color: Color,
    type: Type,
    queen: boolean,
    id: string

  };
  constructor(props: any) {
    super(props);
    this.props = props;
  }

  render() {
    
    let piece = getPieceJSX(this.props.color, this.props.type, this.props.queen)
    return piece;
  }
  
}
