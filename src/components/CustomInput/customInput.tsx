import React from 'react'
import './customInput.scss'
import {
  Link
} from "react-router-dom";

type InputRoomType = {
    placeholder: string,
    value?: string,
    disabled?: boolean,
    className: string,
    handleChange?: (value: string) => void,
    onEnter?: (event: React.KeyboardEvent) => void
}

type InputRoomState = {
    value: string
}

// Create button
export class CustomInput extends React.Component<InputRoomType, InputRoomState>{

    constructor(props: InputRoomType){
        super(props);
        this.state = {value : ''};
    }

    getValueOfButton = () =>{
        return this.state.value;
    }

    onChange = (event : React.FormEvent<HTMLInputElement>) =>{
        this.setState({value : event.currentTarget.value});
        if(this.props.handleChange){
            this.props.handleChange(event.currentTarget.value);
        }
    }

    render(){
        return(
            <input 
                className={`input-field ${this.props.className}`} 
                type="text"  
                onChange={this.onChange} 
                onKeyDown={this.props.onEnter}
                placeholder={this.props.placeholder}
                value={this.props.value ? this.props.value : this.state.value}
                disabled={this.props.disabled}
            >
            </input>
        )

    }
}


