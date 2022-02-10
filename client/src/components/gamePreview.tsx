import React from "react";
import Chessboard from "./board/chessboard";
import Game from "../game";

export default class GamePreview extends React.Component {
    props: {
        games: Game[];
        switchGame: (id: number) => void;
        closeGame: (counter: number, gameId?: number) => void;
    }

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    
   
    render() {
        const games = this.props.games.map((game, i) => {
            return <Chessboard engine={game.engine} preview={true} key={i} 
            label={game.label} game={game} closeGame={this.props.closeGame}
            switchGame={this.props.switchGame}
            />
        });

        return (
            <div className="game-preview" >
                {games}
            </div>
        )
    }
}