import React, { Component } from 'react'


const path = "./img/emojis/";
const emojis = ["10of10", "Clap", "Cry", "Facepalm", "Glasses", "Hacker", "Hands", "Help", "Hmmm", "KEKW", 
"KingCry", "Restless", "Sleep", "Susp", "Think"];

export {path, emojis};


export default class Emojis extends Component {

    props: {
        pickEmoji: (emoji: string) => void
    }

    containerRef: React.RefObject<HTMLDivElement>

    constructor(props: any) {
        super(props);
        this.props = props;
        this.containerRef = React.createRef();
    }

    onClickHandler = (event: React.MouseEvent) => {
        const target = event.target as HTMLImageElement;
        const emoji = target.alt;
        this.props.pickEmoji(emoji);
    }

 

    render() {

        const imgs = emojis.map((emoji) => <img className="emoji" src={path + emoji + ".png"} alt={emoji} onClick={this.onClickHandler}></img>)
        

        return (
            <div id="emoji-container" ref={this.containerRef}>
                {imgs}
            </div>
        )
    }
}
