import React from 'react'
import './inputRoom.scss'
import {
  Link
} from "react-router-dom";

type InputRoomType = {
  placeholder: string,
  handleChange?: (value: string) => void
}

type InputRoomState = {
    value: string
}

// Create button
export class InputRoom extends React.Component<InputRoomType, InputRoomState>{

    constructor(props: InputRoomType){
        super(props);
        this.state = {value : ''};
    }

    getValueOfButton = () =>{
        return this.state.value;
    }

    onChange = (event : React.FormEvent<HTMLInputElement>) =>{
        this.setState({value : event.currentTarget.value});
        console.log('input: ' + event.currentTarget.value + ", " + this.state.value);
        this.props.handleChange && this.props.handleChange(event.currentTarget.value);
    }

    render(){
        return(
            <input className="input-field" type="text"  onChange={this.onChange} placeholder={this.props.placeholder}></input>
        )

    }
}


