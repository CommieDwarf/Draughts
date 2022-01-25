import React from "react";


export default class WinMenu extends React.Component {

    props: {
        winner: "white" | "black" | "";
        restart: () => void,
    }

    constructor(props: any) {
        super(props);
        this.props = props;
    }
    handleClick = () => {
        this.props.restart();
    }

    

    render() {
        let winner: string = this.props.winner
        let visibility = "win-menu--hidden";
        if (winner) {
            winner = winner[0].toUpperCase() + winner.slice(1);
            visibility = "win-menu--visible";
        }
        return (
            <div className={"win-menu " + visibility}>
                <h1>{winner} Wins!</h1>
                <h2 className={"win-menu__play-again"} onClick={this.handleClick}>Play Again?</h2>
            </div>
        )
    }
}