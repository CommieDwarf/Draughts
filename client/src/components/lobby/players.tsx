import React, { Component } from 'react'
import Avatar from "./avatar";
import {IPlayer} from "./lobby";

import { socket } from '../../main';

export default class Players extends Component {

    props: {
        players: IPlayer[],
        canInvite: boolean,
        handlePlayerInvite: (event: any) => void
    }

    constructor(props: any) {
        super(props);
        this.props = props;
    }


    render() {
        const players = this.props.players.map((player, id) => {
            const theme = player.avatar.theme
            const shape = player.avatar.shape 
            const name = player.name;

            let playerClass = "";
            let divClass = ""
            let canInvite = false;
            if (socket.id == player.id) {
                playerClass = "color-white";
            } else if (this.props.canInvite) {
                canInvite = true;
            }
            return (
                <div className={"player " + divClass} key={id} id={player.name} onClick={this.props.handlePlayerInvite}>
                    <Avatar name={name} shape={shape} theme={theme} canInvite={canInvite}/>
                    <span className={"player-name " + playerClass}>{player.name}</span>
                </div>
            )
        })

        return (
            <>
                {players}
            </>
        )
    }
}
