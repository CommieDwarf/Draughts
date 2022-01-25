import React, { createElement, ReactElement } from "react";
import Avatar from "./avatar";

import { Player } from "./lobby";
import { path } from "./emojis";
import { emojis } from "./emojis";


export default class Message extends React.Component {

    props: {
        author: Player,
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
                message.push(<div className="emoji-wrapper"><img src={path + text[i] + ".png"} className="text-emoji" key={i}></img></div>)
            } else {
                message.push(<span key={i}>{text[i] + " "}</span>)
            }
        } 


        let msgAuthorClass = "";

        if (this.props.thisPlayerId == this.props.author.id) {
            msgAuthorClass = "color-white";
        }


        return (
            <div className="message">
                            <div className="message-author">
                                <div id="player1" className="message-author">
                                        <Avatar shape={author.avatar.shape} theme={author.avatar.theme} name={author.name} small={true}/>
                                    <span className={"author-name " + msgAuthorClass}>{this.props.author.name}:</span>
                                </div>
                            </div>
                            <div className={"message-content "}>
                                {message}
                            </div>
                        </div>
        )
    }
}