import React, { ChangeEvent } from "react";

interface Props {
  setName: (name: string) => void;
  error: string;
}

export default class InputName extends React.Component<Props> {
  constructor(props: any) {
    super(props);
  }

  onChangeHandler = (e: ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    this.props.setName(target.value);
  };

  render() {
    return (
      <div className="app__input-name no-select">
        <label htmlFor="name">
          <h1>Enter your name:</h1>
        </label>
        <br />
        <input
          type="text"
          id="name"
          maxLength={6}
          onChange={this.onChangeHandler}
        ></input>
        <div className="app__name-error">{this.props.error}</div>
      </div>
    );
  }
}
