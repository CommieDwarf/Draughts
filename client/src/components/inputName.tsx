import React, { ChangeEvent } from "react";

export default class InputName extends React.Component{

    props: {
        setName: (name: string) => void,
    }

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    onChangeHandler = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
            this.props.setName(target.value);
    }
    
    

    render() {
        return (
            <div className="app__input-name no-select">
                <label htmlFor="name"><h1>Enter your name:</h1></label>
                <br/>
                <input type="text" id="name" maxLength={6} onChange={this.onChangeHandler}>
                </input>
            </div>
        )
    }
}