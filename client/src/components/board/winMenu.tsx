import React from "react";
import Game, { GAMEMODE } from "../../game";
import { socket } from "../../main";
import { IPlayer } from "../lobby/lobby";
import { Rematch } from "../../App";
import Avatar from "../lobby/avatar";
import Players from "../lobby/players";

type Props = {}
type State = {
    rematchSent: boolean
}

export default class WinMenu extends React.Component<Props, State> {

    props: {
        winner: "white" | "black" | "";
        restart: (gameId: string) => void,
        game: Game,
        player: IPlayer
        rematch: Rematch | undefined,
    }

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            rematchSent: false,
        }
    }
    handleClick = () => {
        const props = this.props;
        if (this.props.game.gameMode == GAMEMODE.ONLINE && !this.props.rematch) {
            const rematch = {
                gameId: props.game.id,
                player: props.player,
            }
            socket.emit("player_wants_rematch", rematch)
            this.setState({ rematchSent: true });
        } else if (this.props.rematch) {
            const id = props.game.id ? props.game.id : "";
            this.props.restart(id);
            socket.emit("restart_game", id);
        } else {
            this.props.restart("");
        }
    }

    componentDidMount() {

        socket.on("rematch_accepted", (gameId: string) => {
            this.props.restart(gameId);
        })
    }

    componentWillUnmount() {
        socket.off();
    }

    render() {

        let winner: string = this.props.winner

        const playAgainClass = this.state.rematchSent ? "win-menu__play-again--selected" : "";
        return (
            <div className={"win-menu "}>
                <h1>{winner} Wins!</h1>
                <h2 className={"win-menu__play-again " + playAgainClass} onClick={this.handleClick}>Play Again?</h2>
                {this.props.rematch &&
                    <div className="win-menu__avatar">
                        <Avatar name={this.props.player.name}
                            theme={this.props.player.avatar.theme}
                            shape={this.props.player.avatar.shape}
                        />
                    </div>
                }
                {this.props.rematch &&
                    <h3 className={"win-menu__rematch"}>
                        {this.props.rematch.player &&
                            this.props.player.name + " "}
                        wants rematch!</h3>
                }
                {this.state.rematchSent &&
                    <div className="win-menu__waiting-pawn-div">
                        <img className={"lobby__avatar-placeholder win-menu__waiting-pawn"}
                            src={"./img/pawn.png"}></img>
                    </div>
                }

                {this.state.rematchSent &&
                    <h3 className={"win-menu__rematch"}>
                        Waiting for {this.props.player.name} to accept
                    </h3>}
            </div>
        )
    }
}