import React from 'react';
import { ReactDOM } from 'react';

import TopLabel from './/labels/top-label';
import LeftLabel from './labels/left-label';
import Chessboard from './board/chessboard';
import RightLabel from './labels/right-label';
import BotLabel from './labels/bot-label';
import ContextMenu from "./board/context-menu";
import WinMenu from "./board/winMenu";

import Game from "../game";
import { Color } from './board/getPieceJSX';
import { Engine } from '../engine';

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
        game: Game
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
        this.restartGame = this.restartGame.bind(this);
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

    onContextHandler = (event: any) => {
        event.preventDefault();
        let engine = this.props.game.engine;

        let square = event.target.closest(".square");
        let id;
        let queen;
        let piece;
        let clientX
        let clientY
        if (square && square.className !== "square white") {
            id = square.getAttribute("id");
            queen = engine.chessboard[id]["queen"]
            piece = engine.chessboard[id]["piece"]
            let clientRect = square.getBoundingClientRect();
            clientX = clientRect.left;
            clientY = clientRect.top;
            let width = square.offsetWidth;
            let height = square.offsetHeight;
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

   

    componentDidUpdate() {
        let engine = this.props.game.engine;
        // context menu managment
        

        // win menu managment
        let winMenu = document.getElementById('winMenu');
        if (winMenu) {
            if (engine.winner) {
                winMenu.setAttribute("style", "visibility: visible");
            } else {
                winMenu.setAttribute("style", "visibility: hidden");
            }
        }
    }

    restartGame() {

    }

    render() {
        if (restartFlag) {
            restartFlag = false;
        }
        let engine = this.props.game.engine;
        let ctxMenu = this.state.contextMenu;

        return (
            <div className="board"  onClick={this.clickHandler} onContextMenu={this.onContextHandler}>
                <WinMenu winner={engine.winner} restart={this.restartGame}/>
                <TopLabel/>
                <LeftLabel/>
                <RightLabel/>
                <Chessboard engine = {engine} preview = {false} id={0} game={this.props.game} setWinner={this.setWinner}/>
                <BotLabel/>
                <ContextMenu contextMenu={this.state.contextMenu} chessboard={engine.chessboard}/>
            </div>
        )
    }


}

let restartFlag = false;

