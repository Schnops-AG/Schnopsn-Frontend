import React from 'react'
import {
  Link, match, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Player } from '../../models/player';

type CreateGameProps = {
  title: string,
  player: Player,
  gameType: string,
  match?: match<{}>,

  changeRoomState: (roomName: string) => void
}

type CreateGameState = {
    player: Player,
    roomName: string
}

export function CreateGame(props: CreateGameProps) :JSX.Element {
    const match = useRouteMatch();
    return (<CreateGameUI match={match} {...props}></CreateGameUI>)
}

export class CreateGameUI extends React.Component<CreateGameProps, CreateGameState> {

    constructor(props: CreateGameProps){
        super(props);
        this.state = {player: props.player, roomName: ''};
    }

    changeInputHandler = (value: string) =>{
        this.setState({roomName: value});

        // update roomState (name/url) also in startGame.tsx to enable routing
        this.props.changeRoomState(this.state.roomName);
    }

    setAdmin = (player: Player) =>{
        player.isAdmin = true;
    }

    makeRequest = () =>{
        const requestOptions = {
            method: 'POST'
        };

        // localhost:8080/api/v1/createGame?gameType=_4ERSCHNOPSN&playerID=379ff129-2f72-4943-bd32-a69a3dd5446b
        let gameType :string = this.props.gameType;
        let url :string = `http://localhost:8080/api/v1/createGame?gameType=${gameType}&playerID=${this.state.player.playerID}`;

        fetch(url, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log('result: ' + result);
            },
            (error) => {
                console.log('error: ' + error);
            }
        )
    }

    onClickButton = () =>{
        
        let enteredRoomName = this.state.roomName;
        if(enteredRoomName){
            this.makeRequest();
        }

    }


    render(){
        const lastPathElement = this.props.match?.path.split("/")[this.props.match?.path.split("/").length - 2];
        const url = this.props.match?.url.split("/")[1]
        console.log(url + ", " + lastPathElement);


        return(
            <div className="background-image">
                <div className="background-gradient">
                <h1>{this.props.title}</h1>
                <div className="buttons">
                    <InputRoom placeholder="Enter Room Name" handleChange={this.changeInputHandler}/>
                    <CustomButton className="green" title="Create Game" onHandle={this.onClickButton} path={url + ""}/>
                </div>  
                </div>
            </div>
        )
    }
}
