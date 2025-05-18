import React, { ReactElement } from "react";
import Square from "./Square";
import { Engine, IChessboard } from "../../Engine";
import { Color } from "./getPieceJSX";
import CloseGame from "./CloseGame";
import Game, { GAMEMODE } from "../../Game";
import WinMenu from "./WinMenu";
import { IPlayer } from "../lobby/Lobby";
import { Rematch } from "../../App";

interface Props {
	engine: Engine;
	game: Game;
	preview: boolean;
	label?: string;
	setWinner?: (color: Color) => void;
	closeGame?: (gameId: number) => void;
	switchGame?: (gameId: number) => void;
	restartGame?: (gameId: number) => void;
	player?: IPlayer;
	rematch?: Rematch;
	current?: boolean;
}

interface State {
	bGAnimationColor: "white" | "green";
}

export default class Chessboard extends React.Component<Props, State> {
	chessboardRef: React.RefObject<HTMLDivElement>;
	timeout: null | ReturnType<typeof setTimeout>;

	constructor(props: Props) {
		super(props);
		this.chessboardRef = React.createRef();
		this.timeout = null;
	}

	getPieceType(id: number) {
		let engine = this.props.engine;
		if (engine.selectedPiece == id) {
			return "selected";
		} else if (engine.lockedPieces.includes(id)) {
			return "locked";
		} else if (engine.killablePieces.includes(id)) {
			return "killable";
		} else {
			return "normal";
		}
	}

	getBgAnimationClass() {
		if (this.props.engine.turn == this.props.game.playerColor) {
			return "bg-animation--green";
		} else {
			return "bg-animation--white";
		}
	}

	forceUpdateHandler = () => {
		this.forceUpdate();
		if (this.props.engine.winner && this.props.setWinner) {
			this.props.setWinner(this.props.engine.winner);
		}
	};

	handleClick = () => {
		if (this.props.switchGame) {
			this.props.switchGame(this.props.game.id);
		}
		this.forceUpdate();
	};

	componentDidMount() {
		document.addEventListener("chessboardChanged", this.forceUpdateHandler);
	}

	componentWillUnmount() {
		document.removeEventListener(
			"chessboardChanged",
			this.forceUpdateHandler
		);
	}

	render() {
		const { engine } = this.props;
		const { game } = this.props;
		let squares = [];
		if (engine.chessboard.length > 0) {
			let className = "chessboard__square chessboard__square--black";
			let pieceColor: "black" | "white" | "";

			for (let row = 1; row <= 8; row++) {
				for (let column = 1; column <= 8; column++) {
					if (
						className ==
						"chessboard__square chessboard__square--white"
					) {
						className =
							"chessboard__square chessboard__square--black";
					} else {
						className =
							"chessboard__square chessboard__square--white";
					}
					let id = (row - 1) * 8 + column - 1;
					if (engine.availableMoves.includes(id)) {
						className += " chessboard__square--hightlight";
					}
					pieceColor = engine.chessboard[id]["piece"];
					let queen = engine.chessboard[id]["queen"];

					squares.push(
						<Square
							id={id.toString()}
							className={className}
							key={id}
							pieceColor={pieceColor}
							type={this.getPieceType(id)}
							queen={queen}
						/>
					);
				}
				if (
					className == "chessboard__square chessboard__square--white"
				) {
					className = "chessboard__square chessboard__square--black";
				} else {
					className = "chessboard__square chessboard__square--white";
				}
			}
		}

		let previewWrapperClass = "";
		let previewChessboardClass = "";

		let closeIcon: ReactElement | "" = "";
		let label: ReactElement | "" = "";

		let currentGameClass = "";

		if (this.props.current) {
			currentGameClass = "game-preview__chessboard-wrapper--current";
		}

		if (this.props.preview) {
			previewWrapperClass = "game-preview__chessboard-wrapper";
			previewChessboardClass = "game-preview__chessboard";
			closeIcon = (
				<CloseGame
					gameId={game.id}
					closeGame={this.props.closeGame}
					game={this.props.game}
				/>
			);
			let playerLabelClass = "";
			if (this.props.game.gameMode == GAMEMODE.ONLINE) {
				playerLabelClass = "game-label__label--green";
			}
			label = (
				<div className={"game-preview__label " + playerLabelClass}>
					{this.props.label}
				</div>
			);
		}

		const bgAnimationClass = this.getBgAnimationClass();

		return (
			<div
				className={previewWrapperClass + " " + currentGameClass}
				onClick={this.handleClick}
			>
				{label}

				<div
					className={`chessboard bg-animation ${bgAnimationClass} ${previewChessboardClass}`}
					ref={this.chessboardRef}
				>
					{this.props.game.engine.winner &&
						this.props.restartGame &&
						this.props.player && (
							<WinMenu
								winner={engine.winner}
								restart={this.props.restartGame}
								game={this.props.game}
								player={this.props.player}
								rematch={this.props.rematch}
							/>
						)}
					{squares}
				</div>
				{closeIcon}
			</div>
		);
	}
}
