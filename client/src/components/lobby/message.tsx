import React, { createElement, ReactElement } from "react";
import Avatar from "./avatar";

import { IPlayer } from "./lobby";
import { path } from "./emojis";
import { emojis } from "./emojis";


export default class Message extends React.Component {

    props: {
        author: IPlayer,
        content: string,
        thisPlayerId: string;
    }

    constructor(props: any) {
        super(props);
        this.props = props;

    }




    render() {
        const author = this.props.author;

        
        let text: (string)[] = this.props.content.split(" ")


        let message: ReactElement[] = [];

        for (let i = 0; i < text.length; i++) {
            if (emojis.includes(text[i])) {
                message.push(<div className="lobby__emoji-wrapper"><img src={path + text[i] + ".png"} className="lobby__inline-emoji" key={i}></img></div>)
            } else {
                message.push(<span key={i}>{text[i] + " "}</span>)
            }
        } 


        let msgAuthorClass = "";

        if (this.props.thisPlayerId == this.props.author.id) {
            msgAuthorClass = "lobby__author-name--current";
        }


        return (
            <div className="lobby__message">
                            <div className="lobby__message-author">
                                <div id="player1" className="lobby__message-author">
                                        <Avatar shape={author.avatar.shape} theme={author.avatar.theme} name={author.name} small={true}/>
                                    <span className={"lobby__author-name " + msgAuthorClass}>{this.props.author.name}:</span>
                                </div>
                            </div>
                            <div className={"lobby__message-content "}>
                                {message}
                            </div>
                        </div>
        )
    }
}