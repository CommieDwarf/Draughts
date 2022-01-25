import React, { Component } from 'react'


type Props = {};
type State =  {
    loaded: boolean
    error: boolean
    src: string
}


export default class Avatar extends Component<Props, State> {

    props: {
        name: string,
        theme: string,
        shape: string,
        small?: boolean,
        canInvite: boolean,
    }

    constructor(props: any) {
        super(props);
        this.props = props;
        this.state = {
            loaded: false,
            error: false,
            src: `http://tinygraphs.com/${props.shape}/{${props.name}}?theme=${props.theme}&numcolors=4&size=220&fmt=svg`
        }
    }

    onLoadHandler = () => {
        this.setState({loaded: true});
    }

    onErrorHandler = () => {
        this.setState({
            src: "./img/pawn.png",
            error: true
        });
    }

    render() {
        let divClass = "avatar-div";
        let imgClass = "avatar";
        let inviteClass = "";
        if (this.props.small) {
            divClass = "message-author-avatar-div";
            imgClass = "message-author-avatar";
        } else if (this.props.canInvite) {
            inviteClass = "can-invite";
        }



        return (
            <div className={divClass + " " + inviteClass} >
                {!this.state.loaded && !this.state.error && <img className={"avatar-placeholder " + imgClass} src={"./img/pawn.png"}></img>}
                <img className={imgClass} src={this.state.src} onLoad={this.onLoadHandler} onError={this.onErrorHandler}></img>
            </div>
        )
    }
}
