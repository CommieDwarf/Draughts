
import React, { ReactElement } from 'react';
import Square from './square';
import { Engine, IChessboard } from '../../engine';
import { Color } from './getPieceJSX';
import CloseGame from "./CloseGame"
import Game, { GAMEMODE } from '../../game';

type props = {

}

type state = {
    bGAnimationColor: "white" | "green"
}

export default class Chessboard extends React.Component<props, state> {

    props: {
        engine: Engine;
        game: Game;
        preview: boolean,
        gameCounter: number,
        label?: string;
        setWinner?: (color: Color) => void;
        closeGame?: (gameCounter: number) => void;
    }

    chessboardRef: React.RefObject<HTMLDivElement>;
    timeout: null | ReturnType<typeof setTimeout>

    constructor(props: any) {
        super(props)
        this.props = props;
        this.chessboardRef = React.createRef();
        this.timeout = null;
    }

    getPieceType(id: number) {
        let engine = this.props.engine;
        if (engine.selectedPiece == id) {
            return 'selected';
        } else if (engine.lockedPieces.includes(id)) {
            return "locked";
        } else if (engine.killablePieces.includes(id)) {
            return "killable";
        } else {
            return 'normal';
        }
    }

    

    getBgAnimationClass() {
        if (this.props.engine.turn == this.props.game.playerColor) {
            return "bg-animation--green";
        } else  {
            return "bg-animation--white";
        }
    }

    forceUpdateHandler = () => {
        this.forceUpdate();
        if (this.props.engine.winner && this.props.setWinner) {
            this.props.setWinner(this.props.engine.winner);
        }
    }

   

    componentDidMount() {
        document.addEventListener("chessboardChanged", this.forceUpdateHandler);
    }

    componentWillUnmount() {
        document.removeEventListener("chessboardChanged", this.forceUpdateHandler);
    }

    render() {
        const {engine} = this.props;
        const {game} = this.props;
        let squares = [];
        if (engine.chessboard.length > 0) {

            let className = "chessboard__square chessboard__square--black";
            let pieceColor: "black" | "white" | "";

            for (let row = 1; row <= 8; row++) {
                for (let column = 1; column <= 8; column++) {
                    if (className == "chessboard__square chessboard__square--white") {
                        className = "chessboard__square chessboard__square--black"
                    } else {
                        className = "chessboard__square chessboard__square--white"
                    }
                    let id = (row - 1) * 8 + column - 1;
                    if (engine.availableMoves.includes(id)) {
                        className += " chessboard__square--hightlight";
                    }
                    pieceColor = engine.chessboard[id]['piece'];
                    let queen = engine.chessboard[id]["queen"];


                    squares.push(<Square id={id.toString()} className={className} key={id} pieceColor={pieceColor} type={this.getPieceType(id)} queen={queen} />)
                }
                if (className == "chessboard__square chessboard__square--white") {
                    className = "chessboard__square chessboard__square--black"
                } else {
                    className = "chessboard__square chessboard__square--white"
                }
            }
        }

        let previewWrapperClass = "";
        let previewChessboardClass = "";
        let gameCounter = this.props.gameCounter ? this.props.gameCounter : 0;

        let closeIcon: ReactElement | "" = "";
        let label: ReactElement | "" = "";

        if (this.props.preview) {
            previewWrapperClass = "game-preview__chessboard-wrapper";
            previewChessboardClass = "game-preview__chessboard";
            closeIcon = <CloseGame gameCounter={gameCounter} closeGame={this.props.closeGame} game={this.props.game}/>
            let playerLabelClass = "";
                if (this.props.game.gameMode == GAMEMODE.ONLINE) {
                    playerLabelClass = "game-label__label--green";
                }
            label = (
                <div id={"game-label-preview-" + gameCounter}
                 className={"game-preview__label " + playerLabelClass}>
                    {this.props.label}
                </div>
            )
        }

 
        const bgAnimationClass = this.getBgAnimationClass();

        return (
            <div className={previewWrapperClass}>
                {label}
                <div className={"chessboard bg-animation " + bgAnimationClass + " " + previewChessboardClass} 
                id={("chessboard-" + gameCounter)} ref={this.chessboardRef}>
                    {squares}
                </div>
                {closeIcon}
            </div>
        )
    }

}