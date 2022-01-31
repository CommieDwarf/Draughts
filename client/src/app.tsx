import React from "react";
import Board from "./components/board";
import GameMenu from "./components/gameMenu";
import Lobby from "./components/lobby/lobby";
import GamePreview from "./components/gamePreview";
import Game from "./game";
import { GAMEMODE } from "./game";
import InputName from "./components/inputName";
import { SIDE } from "./config";
import { IPlayer } from "./components/lobby/lobby";

import { socket } from "./main";


type Color = "black" | "white";

type State = {
    name: string;
    games: Game[];
    newGameError: string;
    currentGame: Game | null;
    players: IPlayer[];
    nameTaken: boolean;
}
type Props = {

}

export default class App extends React.Component<Props, State> {

    menuPosition: "center" | "right";
    gameId: number;
    justStarted: boolean;

    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            games: [],
            newGameError: "",
            currentGame: null,
            players: [],
            nameTaken: false,
        }
        this.menuPosition = 'center';
        this.gameId = 0;
        this.justStarted = true;

    }

    setName = (name: string) => {
        this.requestPlayerList()
        this.setState({name});
    }


    getLabel(mode: GAMEMODE) {
        switch (mode) {
            case GAMEMODE.BOT:
                return 'vsComp';
            case GAMEMODE.LOCAL:
                return "local";
            case GAMEMODE.ONLINE:
                return "player";
        }
    }

    connect(name: string) {
        socket.emit("player-connected", name);
    }



    startNewGame = (gameMode: GAMEMODE, side: SIDE, color: Color) => {
        if (this.checkNameTaken(this.state.name, this.state.players)) {
            this.setState({ newGameError: "Name is taken" });
            return false;
        } else if (this.state.games.length < 4 && this.state.name.length > 0) {
            if (this.justStarted) {
                this.connect(this.state.name);
            }
            this.setState((state) => {
                this.justStarted = false;
                const label = this.getLabel(gameMode);
                let game = new Game(gameMode, color, side, label, this.gameId++);
                this.menuPosition = "right";
                return {
                    games: [game, ...state.games],
                    currentGame: game,
                    newGameError: "",
                }
            })
            return true;
        } else if (this.state.games.length == 4) {
            this.setState({ newGameError: "Games max quantity reached. Close a game" });
            return false;

        } else {
            this.setState({ newGameError: "Enter your name" });
            return false;
        }
    }

    switchGame = (id: number) => {
        const game = this.state.games.filter((game) => game.id == id)[0];
        if (game) {
            this.setState({
                currentGame: game
            })
        }
    }

    requestPlayerList() {
        socket.emit("request_players_list");
    }
    checkNameTaken(name: string, players: IPlayer[]) {
        let taken = players.filter((player) => name == player.name);
        if (taken.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    closeGame = (gameId: number) => {
        this.setState((state) => {
            return {
                games: state.games.filter((game) => game.id != gameId),
                currentGame: null,
            }
        })
    }

    componentDidMount() {
        socket.on("get_players", (players) => {
            this.setState({ players })
        })
    }

    render() {
        let games = this.state.games;

        if (!this.justStarted) {
            return (
                <div id="app" className="app">
                    <GamePreview games={games} switchGame={this.switchGame} closeGame={this.closeGame}/>
                    <Lobby name={this.state.name} />
                    <GameMenu startNewGame={this.startNewGame}
                        centered={false}
                        error={this.state.newGameError}
                    />
                    {this.state.currentGame && <Board game={this.state.currentGame} />}
                </div>
            )
        } else {
            return (
                <>
                <InputName setName={this.setName} />
                <GameMenu
                    centered={true}
                    startNewGame={this.startNewGame}
                    error={this.state.newGameError}
                />
                </>
            
            )
        }
    }
}



