import React from "react";
import { SIDE } from "../config";
import { GAMEMODE } from "../game";
import ColorSelection from "./colorSelection"


type Color = "black" | "white";

type Props = {

}

type State = {
    gameTypeVisibility: "game-menu__game-type--hidden" | "game-menu__game-type--visible";
    colorVisibility: "game-menu__color--visible" | "game-menu__color--hidden";
    newGameSelect: "" | "game-menu__game-type--selected";
    gameSelect: "" | "selected-menu"
}


export default class GameMenu extends React.Component<Props, State> {

    props: {
        startNewGame: (gameMode: GAMEMODE, side: SIDE, color: Color) => boolean;
        centered: boolean;
        error: string;
    }

    menuRef: React.RefObject<HTMLDivElement>;

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            gameTypeVisibility: "game-menu__game-type--hidden",
            colorVisibility: "game-menu__color--hidden",
            newGameSelect: "",
            gameSelect: ""
        }
        this.menuRef = React.createRef()
    }

    hideAndUnselectAll() {
        this.setState({
            gameTypeVisibility: "game-menu__game-type--hidden",
            colorVisibility: "game-menu__color--hidden",
            newGameSelect: "",
            gameSelect: ""
        })
    }

    startGame = (event: React.MouseEvent) => {
        let gameMode = GAMEMODE.LOCAL;
        let side = SIDE.NORMAL;
        const target = event.target as HTMLElement;
        if (target) {
            gameMode;
            if (target.closest("#local")) {
                gameMode = GAMEMODE.LOCAL
            } else if (target.closest(".choose-color")) {
                gameMode = GAMEMODE.BOT
                if (target.closest("#choose-white")) {
                    side = SIDE.NORMAL;
                } else {
                    side = SIDE.REVERSED
                }
            } else {
                gameMode = GAMEMODE.ONLINE
            }
        }
        const isStarted = this.props.startNewGame(gameMode, side, "white");
        if (isStarted) {
            this.hideAndUnselectAll();
        }
    }

    toggleShowGames = () => {
        if (this.state.gameTypeVisibility == "game-menu__game-type--hidden") {
            this.setState({ gameTypeVisibility: 'game-menu__game-type--visible' })
        } else {
            this.setState({ gameTypeVisibility: "game-menu__game-type--hidden" })
            this.hideAndUnselectAll();
        }
        this.toggleSelectNewGame();
    }
    toggleShowColor = () => {
        if (this.state.colorVisibility == "game-menu__color--hidden") {
            this.setState({ colorVisibility: 'game-menu__color--visible' })
        } else {
            this.setState({ colorVisibility: "game-menu__color--hidden" })
        }
        this.toggleSelectGame();
    }

    toggleSelectNewGame = () => {
        if (this.state.newGameSelect == "") {
            this.setState({newGameSelect: "game-menu__game-type--selected"})
        } else {
            this.setState({newGameSelect: ""})
        }
    }
    toggleSelectGame = () => {
        if (this.state.gameSelect == "") {
            this.setState({gameSelect: "selected-menu"})
        } else {
            this.setState({gameSelect: ""})
        }
    }

    handleClickOutside = (event: any) => {
        if (this.menuRef.current && !this.menuRef.current.contains(event.target)) {
            this.hideAndUnselectAll();
        }
      }

    componentDidMount = () => {
        document.addEventListener('mousedown', this.handleClickOutside);
    }
    componentWillUnmount = () => {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }
    
    

    render() {
        const menuClass = this.props.centered ? "game-menu--center" : "game-menu--float-right";
        const gameTypeVisibility = this.state.gameTypeVisibility;
        const colorVisibility = this.state.colorVisibility;
        
        return (
            <div className={"game-menu no-select " + menuClass} ref={this.menuRef}>
                <div onClick={this.toggleShowGames} className={"game-menu__new-game " + this.state.newGameSelect}>
                    <h3>Start new game</h3>
                </div>
                <div className="game-menu__games">
                    <div className={"game-menu__game-type " + gameTypeVisibility}
                        onClick={this.startGame}>
                        Local
                    </div>
                    <div
                        className={"game-menu__game-type " + "game-menu__game-type--vsComp " + gameTypeVisibility + " " + this.state.gameSelect}
                        onClick={this.toggleShowColor}
                    >
                        Versus computer
                    </div>
                    <div className={"game-menu__game-type " + gameTypeVisibility}
                        onClick={this.startGame}>
                        Online
                    </div>
                </div>
                <ColorSelection
                    startNewGame={this.props.startNewGame}
                    visibility={colorVisibility}
                />
                <p className="game-menu__error">{this.props.error}</p>
            </div>
        )
    }
}

