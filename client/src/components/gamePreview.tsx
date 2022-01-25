import React from "react";
import Chessboard from "./board/chessboard";
import Game from "../game";

export default class GamePreview extends React.Component {
    props: {
        games: Game[];
        switchGame: (id: number) => void;
    }

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    onClickHandler = (event: any) => {
        const {target} = event;
        const chessboard = target.closest('.chessboard');
        if (chessboard) {
            const id = chessboard.id.slice(-1);
            this.props.switchGame(id);
        }
        this.forceUpdate();
    }

    render() {
        const games = this.props.games.map((game, i) => {
            return <Chessboard engine={game.engine} preview={true} key={i} id={game.id} label={game.label} game={game} />
        });

        return (
            <div className="game-preview" onClick={this.onClickHandler}>
                {games}
            </div>
        )
    }
}