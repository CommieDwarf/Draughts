import React, { Component } from "react";

interface Props {
  name: string;
    theme: string;
    shape: string;
    small?: boolean;
    invitable?: boolean;
};
interface State {
  loaded: boolean;
  error: boolean;
  src: string;
};

export default class Avatar extends Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      src: `http://tinygraphs.com/${props.shape}/{${props.name}}?theme=${props.theme}&numcolors=4&size=220&fmt=svg`,
    };
  }

  onLoadHandler = () => {
    this.setState({ loaded: true });
  };

  onErrorHandler = () => {
    this.setState({
      src: "./img/pawn.png",
      error: true,
    });
  };

  render() {
    let divClass = "lobby__avatar-div";
    let imgClass = "lobby__avatar-img";
    let inviteClass = "";
    if (this.props.small) {
      divClass = "lobby__author-avatar-div";
      imgClass = "lobby__author-avatar-img";
    } else if (this.props.invitable) {
      inviteClass = "lobby__player--invitable";
    }

    return (
      <div className={divClass + " " + inviteClass}>
        {!this.state.loaded && !this.state.error && (
          <img
            className={"lobby__avatar-placeholder " + imgClass}
            src={"./img/pawn.png"}
          ></img>
        )}
        <img
          className={imgClass}
          src={this.state.src}
          onLoad={this.onLoadHandler}
          onError={this.onErrorHandler}
        ></img>
      </div>
    );
  }
}
