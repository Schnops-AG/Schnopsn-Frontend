import React, { Component } from 'react'
import './infoBox.scss';

type InfoBoxProps = {
    type: string,
    title: string,
    children: React.ReactNode

    onClose?: () => any|void
}

type InfoBoxState = {
    type: string
}

export class InfoBox{
    type: string;
    title: string;
    children: React.ReactNode;

    constructor(type: string, title: string, children: React.ReactNode){
        this.type = type;
        this.title = title;
        this.children = children;
    }
}

export default class InfoBoxComponent extends Component<InfoBoxProps, InfoBoxState> {

    constructor(props: InfoBoxProps){
        super(props);

        this.state = {
            type : props.type
        };
    }

    onClose = () =>{
        console.log('closing message box..');
        this.setState({type : 'none'});

        if(this.props.onClose){
            this.props.onClose();
        }
    }

    changeType = (type: string) =>{
        this.setState({type : type});
    }


    render() {
        return (
            <div className={`infoBox ${this.state.type}`}>
                <div className="head">
                    <span id="title">{this.props.title}</span>
                    <span onClick={this.onClose} id="close">x</span>
                </div>
                <div className="content">{this.props.children} + {this.state.type}</div>
            </div>
    )
    }
}




