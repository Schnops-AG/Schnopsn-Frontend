import { resolve } from 'node:path';
import React from 'react'
import {
  Link, match, useHistory, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { CustomInput } from '../../components/CustomInput/customInput';
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


    /**
     * this method makes the actual request
     */
    makeRequest() :Promise<void>{

        let gameType :string = this.props.gameType;
        if(!gameType || !this.state.player.playerID){
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
    onClickButton(event : React.MouseEvent<HTMLButtonElement>){
        event.preventDefault();
        event.stopPropagation();

        console.log(this.handleSubmit);

        this.handleSubmit();
    }
    
    onEnter = (event: React.KeyboardEvent) =>{
        if(event.key === 'Enter'){
            this.handleSubmit().catch((r)=> console.log('catch'));
        }
    }

    async handleSubmit(){

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
                    <div className="create-join">
                        <CustomInput className="input-room" placeholder="Enter Room Name" handleChange={this.changeInputHandler} onEnter={this.onEnter}/>
                        <CustomButton className="green" title="Create Room" onHandle={(e) => this.onClickButton(e)} path={`${this.waitingRoomRoute}`}/>
                    </div>  
                </div>
            </div>
        )
    }
}
