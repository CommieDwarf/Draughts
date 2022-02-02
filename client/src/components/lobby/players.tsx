import React, { Component } from 'react'
import Avatar from "./avatar";
import {IPlayer} from "./lobby";

import { socket } from '../../main';

export default class Players extends Component {

    props: {
        players: IPlayer[],
        invitable: boolean,
        handlePlayerInvite: (event: any) => void,
        rooms: {
            name: string,
            id: string,
        }[],
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

            let spanClass = "";
            if (socket.id == player.id) {
                spanClass = "lobby__player--current";
            }
            let canBeInvited = false;
            if (this.props.invitable && player.id !== socket.id && !this.props.rooms.some((room) => room.name == player.name)) {
                canBeInvited = true;
            } 
            return (
                <div className={"lobby__player "} key={id} id={player.name} onClick={this.props.handlePlayerInvite}>
                    <Avatar name={name} shape={shape} theme={theme} invitable={canBeInvited}/>
                    <span className={"player-name " + spanClass}>{player.name}</span>
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
