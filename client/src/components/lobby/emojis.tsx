import React, { Component } from 'react'


const path = "./img/emojis/";
const emojis = ["10of10", "Clap", "Cry", "Facepalm", "Glasses", "Hacker", "Hands", "Help", "Hmmm", "KEKW", 
"KingCry", "Restless", "Sleep", "Susp", "Think"];

export {path, emojis};


export default class Emojis extends Component {

    props: {
        pickEmoji: (emoji: string) => void;
        emoContainerDivRef: React.RefObject<HTMLDivElement>
    }


    constructor(props: any) {
        super(props);
        this.props = props;
    }

    onClickHandler = (event: React.MouseEvent) => {
        const target = event.target as HTMLImageElement;
        const emoji = target.alt;
        this.props.pickEmoji(emoji);
    }

 

    render() {

        const imgs = emojis.map((emoji, id) => <img className="lobby__emoji" key={id} src={path + emoji + ".png"} alt={emoji} onClick={this.onClickHandler}></img>)
        
        return (
            <div className="lobby__emoji-container" ref={this.props.emoContainerDivRef}>
                {imgs}
            </div>
        )
    }
}
