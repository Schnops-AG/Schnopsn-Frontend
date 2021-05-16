import { resolve } from 'node:path';
import React from 'react'
import {
  Link, match, useHistory, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { History } from 'history';

type CreateGameProps = {
  title: string,
  player: Player,
  gameType: string,
  match?: match<{}>,
  history?: History,

  changeRoomState: (roomName: string) => void,
  setGame: (game: Game) => void
}

type CreateGameState = {
    player: Player,
    roomName: string
}

export function CreateGame(props: CreateGameProps) :JSX.Element {
    const match = useRouteMatch();
    const history = useHistory();
    return (<CreateGameUI match={match} history={history} {...props}></CreateGameUI>)
}

export class CreateGameUI extends React.Component<CreateGameProps, CreateGameState> {

    waitingRoomRoute?: string = '';
    game?: Game;

    constructor(props: CreateGameProps){
        super(props);
        this.state = {player: props.player, roomName: ''};
    }

    changeInputHandler = (value: string) =>{
        this.setState({roomName: value});

        // update roomState (name/url) also in startGame.tsx to enable routing
        this.props.changeRoomState(this.state.roomName);

        this.waitingRoomRoute = value ? 'waitingRoom' : '';


    }

    setAdmin = (player: Player) =>{
        player.isAdmin = true;
    }

    /**
     * this method makes the actual request
     */
    makeRequest() :Promise<void>{

        let gameType :string = this.props.gameType;
        if(!gameType || !this.state.player.playerID){
            console.log('request not possible');
            return Promise.resolve();
        }


        const requestOptions = {
            method: 'POST'
        };

        // localhost:8080/api/v1/createGame?gameType=_4ERSCHNOPSN&playerID=379ff129-2f72-4943-bd32-a69a3dd5446b
        let url :string = `http://localhost:8080/api/v1/createGame?gameType=${gameType}&playerID=${this.state.player.playerID}`;

        const response = fetch(url, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log('result: ' + result);
                console.log(result);
                this.game = result;
            },
            (error) => {
                console.log('error: ' + error);
                this.game = {} as Game;
            }
        )
        return response;
    }

    /**
     * handler for the `Create Room` button
     * @param event the event from the `button`
     * @returns an empty promise
     */
    async onClickButton(event : React.MouseEvent<HTMLButtonElement>) :Promise<void>{
        event.preventDefault();
        event.stopPropagation();

        // check if game has already been created
        if(this.game){
            return;
        }


        // check if room name was entered
        if(this.state.roomName){
            await this.makeRequest(); // waits for the request to finish
        }


        // check if game creation was successful (if not: prevent propagation)
        if(this.game){
            console.log('redirect to waiting room');
            console.log(this.game);

            // set game --> startGame (for routing)
            this.props.setGame(this.game);  

            // redirects to the waiting room
            this.props.history?.push('waitingRoom');
        }
    }


    render(){

        return(
            <div className="background-image">
                <div className="background-gradient">
                <h1>{this.props.title}</h1>
                <div className="buttons">
                    <InputRoom placeholder="Enter Room Name" handleChange={this.changeInputHandler}/>
                    <CustomButton className="green" title="Create Room" onHandle={(e) => this.onClickButton(e)} path={`${this.waitingRoomRoute}`}/>
                </div>  
                </div>
            </div>
        )
    }
}
