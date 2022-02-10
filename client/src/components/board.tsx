import React from 'react';

import TopLabel from './/labels/top-label';
import LeftLabel from './labels/left-label';
import Chessboard from './board/chessboard';
import RightLabel from './labels/right-label';
import BotLabel from './labels/bot-label';
import ContextMenu from "./board/context-menu";
import WinMenu from "./board/winMenu";

import Game, { GAMEMODE } from "../game";
import { Color } from './board/getPieceJSX';
import { socket } from '../main';
import { ISquare } from '../engine';
import { IPlayer } from './lobby/lobby';
import { Rematch } from '../App';
import gameMenu from './gameMenu/gameMenu';
import tsify from 'tsify';

export type GameInfo = {
    chessboard: ISquare[],
    id: number | undefined,
    turn: "black" | "white",
    winner: "black" | "white" | "",
    roomId: string,
}

type MyState = {
    contextMenu: {
        piece: string,
        queen: boolean,
        i: number,
        clientX: number,
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
        restartGame: (gameId: number) => void;
        player: IPlayer;
        rematches: Rematch[],
    }

    interval: ReturnType<typeof setTimeout> | null;
    contextMenuRef: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            contextMenu: {
                piece: "",
                queen: false,
                i: 0,
                clientX: 0,
                clientY: 0,
                showMenu: false,
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
        console.log(this.props.game.roomId);
        if (this.props.game.gameMode == GAMEMODE.ONLINE && this.props.game.roomId) {
            let gameInfo: GameInfo = {
                chessboard: this.props.game.engine.chessboard,
                id: this.props.game.id,
                turn: this.props.game.engine.turn,
                winner: this.props.game.engine.winner,
                roomId: this.props.game.roomId,
            }
            socket.emit("make_move", gameInfo);
        }
    }

    hideContextMenu = () => {
        this.setState((prevState) => {
            return {
                contextMenu: { ...prevState.contextMenu, showMenu: false }
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

            this.setState({
                contextMenu: {
                    piece: piece,
                    queen: queen,
                    i: id,
                    clientX: clientX,
                    clientY: clientY,
                    showMenu: true,
                }
            })
        }

        return false;
    }





    render() {
        if (restartFlag) {
            restartFlag = false;
        }
        let engine = this.props.game.engine;
        const rematch = this.props.rematches.find((r) => r.gameId == this.props.game.id)

        return (
            <div className="board" onClick={this.clickHandler} onContextMenu={this.onContextHandler}>
                {this.props.game.engine.winner &&
                    <WinMenu winner={engine.winner}
                        restart={this.props.restartGame}
                        game={this.props.game}
                        player={this.props.player}
                        rematch={rematch}
                    />}
                <TopLabel />
                <LeftLabel />
                <RightLabel />
                <Chessboard engine={engine} preview={false} game={this.props.game} setWinner={this.setWinner} />
                <BotLabel />
                {this.state.contextMenu.showMenu && <ContextMenu contextMenu={this.state.contextMenu} chessboard={engine.chessboard} hide={this.hideContextMenu} />}
            </div>
        )
    }


}

let restartFlag = false;

