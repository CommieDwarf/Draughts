import React from "react";
import Board from "./components/board";
import GameMenu from "./components/gameMenu/gameMenu";
import Lobby from "./components/lobby/lobby";
import GamePreview from "./components/gamePreview";
import Game from "./game";
import { GAMEMODE } from "./game";
import InputName from "./components/inputName";
import { SIDE } from "./config";
import { IPlayer } from "./components/lobby/lobby";
import ConnectMenu from "./components/connectMenu";

import { socket } from "./main";
import Chessboard from "./components/board/chessboard";


type Color = "black" | "white";

type State = {
    name: string;
    games: Game[];
    newGameError: string;
    currentGame: Game | null;
    players: IPlayer[];
    connected: boolean;
    nameError: string;
}
type Props = {

}

export default class App extends React.Component<Props, State> {

    menuPosition: "center" | "right";
    gameCounter: number;
    justStarted: boolean;

    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            games: [],
            newGameError: "",
            currentGame: null,
            players: [],
            connected: false,
            nameError: "",
        }
        this.menuPosition = 'center';
        this.gameCounter = 0;
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

    connect = () => {
        if (this.state.name.length == 0) {
            this.setState({nameError: "Enter your name"})
        } else if (this.checkNameTaken()) {
            this.setState({nameError: "This name is taken"})
        } else {
            socket.emit("player-connected", this.state.name);
            this.setState({connected: true});
        }
        
    }

    startNewGame = (gameMode: GAMEMODE, side: SIDE, color: Color, label: string): boolean => {
        if (this.state.games.length == 4) {
            this.setState({newGameError: "Game quantity reached. Close some game"})
            return false;
        } else {
            const game = new Game(gameMode, color, side, label, this.gameCounter++);
            this.setState((prevState) => {
                return {
                    currentGame: game,
                    games: [...prevState.games, game]
                }
            })
            return true;
        }
        
    }




    switchGame = (count: number) => {
        const game = this.state.games.filter((game) => game.gameCounter == count)[0];
        if (game) {
            this.setState({
                currentGame: game
            })
        }
    }

    requestPlayerList() {
        socket.emit("request_players_list");
    }
    checkNameTaken() {
        let taken = this.state.players.filter((player) => this.state.name == player.name);
        if (taken.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    closeGame = (gameCounter: number) => {
        console.log(gameCounter);
        this.setState((state) => {
            return {
                games: state.games.filter((game) => game.gameCounter != gameCounter),
                currentGame: null,
            }
        })
    }
    restartGame =() => {
        const game = this.state.currentGame;

        if (game) {
            let index = this.state.games.findIndex((g) => {
                return g.gameCounter == game.gameCounter;
            });
            let games = this.state.games;
            const newGame = new Game(game.gameMode, game.playerColor, game.side, game.label, game.gameCounter);
            games[index] = newGame;
            this.setState({games, currentGame: newGame});
        }
    }

    componentDidMount() {
        socket.on("get_players", (players) => {
            this.setState({ players })
        })
    }

    render() {
        let games = this.state.games;
        let gameMenuCentered = this.state.currentGame ? false : true;
        if (this.state.connected) {
            return (
                <div id="app" className="app">
                    <GamePreview games={games} switchGame={this.switchGame} closeGame={this.closeGame}/>
                    <Lobby name={this.state.name} startNewGame={this.startNewGame}/>
                    <GameMenu startNewGame={this.startNewGame} 
                    centered={gameMenuCentered} 
                    error={this.state.newGameError}
                    games={this.state.games}/>
                    {this.state.currentGame && <Board game={this.state.currentGame} restartGame={this.restartGame} />}
                </div>
            )
        } else {
            return (
                <>
                    <InputName setName={this.setName} error={this.state.nameError}/>
                    <ConnectMenu connect={this.connect}/>

                </>
            
            )
        }
    }
}



