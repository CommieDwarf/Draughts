import React from 'react';
import {IChessboard} from "../../engine";


export default class ContextMenu extends React.Component {

    ctxMenuRef: React.RefObject<HTMLDivElement>

    props: {
        queen: boolean;
        piece: string;
        id: number;
        chessboard: IChessboard;
    }
    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {}
    }

    onClickTopHandler = () => {
        let props = this.props
        if (props.queen) {
            props.chessboard[props.id]["queen"] = false;
        } else if (props.piece) {
            props.chessboard[props.id]['queen'] = true;
        } else {
            props.chessboard[props.id]["piece"] = "black";
        }
    }
    onClickBotHandler = () => {
        let props = this.props
        if (props.queen) {
            props.chessboard[props.id]["piece"] = "";
            props.chessboard[props.id]["queen"] = false;
        } else if (props.piece) {
            props.chessboard[props.id]['piece'] = "";
        } else {
            props.chessboard[props.id]["piece"] = "white";
        }
    }

    componentDidUpdate() {
        let contextMenu =  
        if (contextMenu) {
            let attribute = "left: " + this.state.contextMenu.clientX + "px; "
            attribute += "top: " + this.state.contextMenu.clientY + "px; "
            if (this.state.contextMenu.showMenu) {
                attribute += "visibility: visible";
            } else {
                attribute += "visibility: hidden";
            }
            contextMenu.setAttribute("style", attribute);
        }
    }


    render() {
        let props = this.props;

        let label1
        let label2
        
        if (props.queen) {
            label1 = "queen";
            label2 = "remove";
        } else if (props.piece) {
            label1 = "queen";
            label2 = "remove";
        } else {
            label1 = "black";
            label2 = "white";
        }
        
        return (
            <div className = "context-menu" ref={this.props.ctxRef}>
                <div className="context-menu__label" onClick={this.onClickTopHandler}> 
                {label1}
                </div>
                <hr/>
                <div className="context-menu__label" onClick={this.onClickBotHandler}> 
                {label2}
                </div>
                <br></br>
            </div>
        )
    }
    
}