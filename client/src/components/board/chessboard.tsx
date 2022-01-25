
import React, { ReactElement } from 'react';
import Square from './square';
import { IChessboard } from '../../engine';
import { Color } from './getPieceJSX';

type props = {

}

type state = {
    bGAnimationColor: "white" | "green"
}

export default class Chessboard extends React.Component<props, state> {

    props: {
        engine: {
            selectedPiece: number | null,
            lockedPieces: number[],
            killablePieces: number[],
            availableMoves: number[],
            chessboard: IChessboard,
            turn: "black" | "white",
            winner: "" | Color,
        };
        game: {
            playerColor: "black" | "white";
        };
        preview: boolean,
        id: number,
        label?: string;
        setWinner?: (color: Color) => void;
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

    componentDidMount() {
        this.setBackgroundColor();
    }

    setBackgroundColor() {
        if (this.props.engine.turn == this.props.game.playerColor && this.chessboardRef.current) {
            this.chessboardRef.current.style.color = "lightgreen";
        } else if (this.chessboardRef.current) {
            this.chessboardRef.current.style.color = "white";
        }
    }

    render() {
        const {engine} = this.props;
        const {game} = this.props;
        let squares = [];

        if (engine.chessboard.length > 0) {

            let className = "square";
            let pieceColor: "black" | "white" | "";

            for (let row = 1; row <= 8; row++) {
                for (let column = 1; column <= 8; column++) {
                    className = className == "square white" ? "square" : "square white";
                    let id = (row - 1) * 8 + column - 1;
                    if (engine.availableMoves.includes(id)) {
                        className += " highlightedSquare";
                    }
                    pieceColor = engine.chessboard[id]['piece'];
                    let queen = engine.chessboard[id]["queen"];


                    squares.push(<Square id={id.toString()} className={className} key={id} pieceColor={pieceColor} type={this.getPieceType(id)} queen={queen} />)
                }
                className = className == "square white" ? "square" : "square white";
            }
        }

        let previewWrapperClass = "";
        let previewChessboardClass = "";
        let id = this.props.id ? this.props.id : 0;

        let closeIcon: ReactElement | "" = "";
        let label: ReactElement | "" = "";

        if (this.props.preview) {
            previewWrapperClass = "game-preview__chessboard-wrapper";
            previewChessboardClass = "game-preview__chessboard";
            closeIcon = (
                <div id={"close-game-" + id} className="game-preview__close-game">
                    <i className="icon-cancel-circled"></i>
                </div>)
            label = (
                <div id={"game-label-preview-" + id} className="game-preview__label">
                    {this.props.label}
                </div>
            )
        }

        
        this.setBackgroundColor();

        return (
            <div className={previewWrapperClass}>
                {label}
                <div className={"chessboard bg-animation " + previewChessboardClass} id={("chessboard-" + id)} ref={this.chessboardRef}>
                    {squares}
                </div>
                {closeIcon}
            </div>
        )
    }

}