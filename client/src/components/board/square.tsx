import React from 'react';
import Piece from './piece';
import {Type} from "./getPieceJSX";


export default class Square extends React.Component {
    props: {
        pieceColor: 'white' | "black" | "",
        id: string,
        className: string
        type: Type,
        queen: boolean,
    }
    constructor(props: any) {
        super(props);
        this.props = props
        
    }

    render() {


        return (
            <div id={this.props.id} className={this.props.className}>
                <Piece color={this.props.pieceColor}  id={this.props.id} type={this.props.type} queen={this.props.queen}/>
            </div>
            
        )
    }
}