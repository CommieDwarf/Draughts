import React from 'react';
import { IChessboard } from "../../engine";


export default class ContextMenu extends React.Component {

    ctxMenuRef: React.RefObject<HTMLDivElement>
    // dsad
    props: {
        contextMenu: {
            piece: string,
            queen: boolean,
            i: number,
            clientX: number,
            clientY: number,
            showMenu: boolean
        }
        chessboard: IChessboard;
    }
    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {}
        this.ctxMenuRef = React.createRef();
    }

    onClickTopHandler = () => {
        let props = this.props
        if (props.contextMenu.queen) {
            props.chessboard[props.contextMenu.i]["queen"] = false;
        } else if (props.contextMenu.piece) {
            props.chessboard[props.contextMenu.i]['queen'] = true;
        } else {
            props.chessboard[props.contextMenu.i]["piece"] = "black";
        }
    }

    

    
    onClickBotHandler = () => {
        let props = this.props
        if (props.contextMenu.queen) {
            props.chessboard[props.contextMenu.i]["piece"] = "";
            props.chessboard[props.contextMenu.i]["queen"] = false;
        } else if (props.contextMenu.piece) {
            props.chessboard[props.contextMenu.i]['piece'] = "";
        } else {
            props.chessboard[props.contextMenu.i]["piece"] = "white";
        }
    }

    componentDidUpdate() {
        let contextMenu = this.ctxMenuRef.current;
        
        if (contextMenu) {
            let attribute = "left: " + this.props.contextMenu.clientX + "px; "
            attribute += "top: " + this.props.contextMenu.clientY + "px; "
            if (this.props.contextMenu.showMenu) {
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
            <div className="context-menu" ref={this.ctxMenuRef}>
                <div className="context-menu__label" onClick={this.onClickTopHandler}>
                    {label1}
                </div>
                <hr />
                <div className="context-menu__label" onClick={this.onClickBotHandler}>
                    {label2}
                </div>
                <br></br>
            </div>
        )
    }

}