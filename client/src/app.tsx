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
import reverseChessboard from "./reverseChessboard";

import { socket } from "./main";



type Color = "black" | "white";
export type Rematch = {
    requested: boolean,
    player: IPlayer | null,
    gameId: string,
}

type State = {
    name: string;
    games: Game[];
    newGameError: string;
    currentGame: Game | null;
    players: IPlayer[];
    connected: boolean;
    nameError: string;
    rematches: Rematch[]
    
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
            rematches: [],
        }
        this.menuPosition = 'center';
        this.gameCounter = 0;
        this.justStarted = true;

    }

    

    

    setName = (name: string) => {
        socket.emit("request_players_list");
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

    startNewGame = (gameMode: GAMEMODE, side: SIDE, color: Color, label: string, gameId = ""): boolean => {
      
            const game = new Game(gameMode, color, side, label, this.gameCounter++, gameId);
            this.setState((prevState) => {
                return {
                    currentGame: game,
                    games: [...prevState.games, game]
                }
            })
            return true;
    }




    switchGame = (count: number) => {
        const game = this.state.games.filter((game) => game.gameCounter == count)[0];
        if (game) {
            this.setState({
                currentGame: game
            })
        }
    }

   
    checkNameTaken() {
        let taken = this.state.players.filter((player) => this.state.name == player.name);
        if (taken.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    closeGame = (gameCounter: number, gameId="") => {
        if (!gameId) {
            this.setState((state) => {
                return {
                    games: state.games.filter((game) => game.gameCounter != gameCounter),
                    currentGame: null,
                }
            })
        } else {
            const game = this.state.games.find((g) => g.id == gameId);
            if (game == this.state.currentGame) {
                this.setState((state) => {
                    return {
                        games: state.games.filter((g => g.id != gameId)),
                        currentGame: null,
                    }
                })
            } else {
                this.setState((state) => {
                    return {
                        games: state.games.filter((g => g.id != gameId)),
                    }
                }) 
            }
        }


            
        
    }
    restartGame =(gameId: string = "") => {
        let game: any;
        if (gameId) {
            game = this.state.games.find((g) => g.id == gameId);
        } else {
            game = this.state.currentGame;
        }

        if (game) {
            let index = this.state.games.findIndex((g) => {
                return g.gameCounter == game.gameCounter;
            });
            let games = this.state.games;
            const newGame = new Game(game.gameMode, game.playerColor, game.side, game.label, game.gameCounter, gameId);
            games[index] = newGame;
            this.setState({games, currentGame: newGame});
        }
    }

    getPlayer(name: string) {
        let player = this.state.players.find((player) => player.name == name);
        if (!player) {
            player = this.state.players[0];
        }
        return player
    }

    componentDidMount() {
        socket.on("get_players", (players) => {
            this.setState({ players })
        })

        socket.on("player_disconnected", (player: IPlayer) => {
            const game = this.state.games.find((g) => g.label == player.name);
            if (game) {
                this.closeGame(0, game.id);
            }
        })

        socket.on("move_made", ({chessboard, id, turn, winner}) => {
                this.setState((prevState) => {
                    const gameIndex = prevState.games.findIndex((g) => g.id == id)
                    let gamesBefore = prevState.games.slice(0, gameIndex)
                    let gamesAfter = prevState.games.slice(gameIndex + 1, prevState.games.length)
                    let game = prevState.games[gameIndex];
                    game.engine.chessboard = reverseChessboard(chessboard);
                    game.engine.turn = turn;
                    game.engine.winner = winner;
                    game.engine.playerSide = "bot";
                    const currentGame = prevState.currentGame;
                    if (prevState.currentGame?.id == id) {
                        currentGame == game;
                    }
                    return {
                        games: [...gamesBefore, game, ...gamesAfter],
                        currentGame: currentGame,
                    }
                })
               
        })

        socket.on("player_wants_rematch", ({player, gameId}) => {
            this.setState((prevState) => {
                const rematch = {player, gameId, requested: true}
                return {
                    rematches: [...prevState.rematches, rematch]
                }
            })
        })
        socket.on("game_restarted", (id: string) => {
            this.restartGame(id);
        })

        socket.on("player_closed_game", (id: string) => {
            this.closeGame(0, id);
        })
    }

    render() {
        const player = this.getPlayer(this.state.name);
        
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
                    {this.state.currentGame && 
                    <Board game={this.state.currentGame} 
                    restartGame={this.restartGame} player={player} 
                    rematches={this.state.rematches}/>}
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



