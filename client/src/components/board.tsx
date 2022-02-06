import React from 'react';

import TopLabel from './/labels/top-label';
import LeftLabel from './labels/left-label';
import Chessboard from './board/chessboard';
import RightLabel from './labels/right-label';
import BotLabel from './labels/bot-label';
import ContextMenu from "./board/context-menu";
import WinMenu from "./board/winMenu";

import Game from "../game";
import { Color } from './board/getPieceJSX';

type MyState = {
    contextMenu: {
        piece: string,
        queen: boolean,
        i: number,
        clientX : number,
        clientY: number,
        showMenu: boolean
    },
    winner: "" | Color
}
type MyProps = {
    
}

export default class Board extends React.Component<MyProps, MyState> {
    

    props: {
        game: Game;
        restartGame: () => void;
    }

    interval: ReturnType<typeof setTimeout> | null;
    contextMenuRef: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = { 
            contextMenu: {
                piece: "",
                queen : false, 
                i : 0,
                clientX : 0, 
                clientY : 0,
                showMenu : false,
            },
            winner: "",
        };
        this.contextMenuRef = React.createRef();
        this.interval = null;
    }

    setWinner = (winner: Color) => {
        this.setState({
            winner: winner
        })
    }

    clickHandler = (event: any) => {
        //this.setState({contextMenu: {...this.state.contextMenu, showMenu: false}});
        this.props.game.clickHandler(event);
    }

    hideContextMenu = () => {
        this.setState((prevState) => {
            return {
                contextMenu: {...prevState.contextMenu, showMenu: false}
            }
        })
    }

    onContextHandler = (event: any) => {
        event.preventDefault();
        let engine = this.props.game.engine;

        let square = event.target.closest(".chessboard__square");
        if (square && square.className !== "chessboard__square chessboard__square--white") {
            let id = square.getAttribute("id");
            const queen = engine.chessboard[id]["queen"]
            const piece = engine.chessboard[id]["piece"]
            let clientRect = square.getBoundingClientRect();
            let clientX = clientRect.left;
            let clientY = clientRect.top;
            const width = square.offsetWidth;
            const height = square.offsetHeight;
            clientX += width / 2;
            clientY += height / 2 + 10;

            this.setState({contextMenu: {
                piece: piece,
                queen : queen, 
                i : id,
                clientX : clientX, 
                clientY : clientY,
                showMenu : true,
            }})
        }
        
        return false;
    }

   



    render() {
        if (restartFlag) {
            restartFlag = false;
        }
        let engine = this.props.game.engine;


        return (
            <div className="board"  onClick={this.clickHandler} onContextMenu={this.onContextHandler}>
                {this.props.game.engine.winner && <WinMenu winner={engine.winner} restart={this.props.restartGame}/>}
                <TopLabel/>
                <LeftLabel/>
                <RightLabel/>
                <Chessboard engine = {engine} preview = {false} gameCounter={0} game={this.props.game} setWinner={this.setWinner}/>
                <BotLabel/>
                {this.state.contextMenu.showMenu && <ContextMenu contextMenu={this.state.contextMenu} chessboard={engine.chessboard} hide={this.hideContextMenu}/>}
            </div>
        )
    }


}

let restartFlag = false;

