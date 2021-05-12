import React from 'react'
import {
  Link, useRouteMatch, match, useHistory
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { History } from 'history';


type JoinGameProps = {
  title: string,
  player: Player,
  gameID: string,
  match?: match<{}>,
  history?: History,

  changeRoomState: (roomUrl: string) => void
}

type JoinGameState = {
    player: Player,
    roomUrl: string
}

export function JoinGame(props: JoinGameProps) :JSX.Element {
    const match = useRouteMatch();
    const history = useHistory();
    return (<JoinGameUI match={match} history={history} {...props}></JoinGameUI>)
}


export default class JoinGameUI extends React.Component<JoinGameProps, JoinGameState> {

    waitingRoomRoute?: string = '';
    game?: Game|null;

    constructor(props: JoinGameProps){
        super(props);
        this.state = {player: props.player, roomUrl: ''};
    }

    changeInputHandler = (value: string) =>{
        this.setState({roomUrl: value});
        this.props.changeRoomState(this.state.roomUrl);
        this.waitingRoomRoute = value ? 'waitingRoom' : '';
    }

    setAdmin = (player: Player) =>{
        player.isAdmin = false;
    }


    makeRequest() :Promise<void>{
        let gameID :string = this.state.roomUrl; // TODO Bug
        console.log('request?: ' + gameID);
        if(!gameID || !this.state.player.playerID){
            console.log('request not possible');
            return Promise.resolve();
        }

        

        const requestOptions = {
            method: 'POST'
        };

        // localhost:8080/api/v1/createGame?gameType=_4ERSCHNOPSN&playerID=379ff129-2f72-4943-bd32-a69a3dd5446b
        let url :string = `http://localhost:8080/api/v1/joinGame?gameID=${gameID}&playerID=${this.state.player.playerID}`;
        
        const response = fetch(url, requestOptions) // BUG: erkennt fehler nicht als fehler
        .then(res => res.json())
        .then(
            (result) => {
                const game :Game = result;
                console.log(game);
                if(!(game.gameID)){
                    this.game = null;
                    console.log('no Game');
                    return;
                }

                console.log('here');
                console.log('result: ' + result);
                console.log(result);
                this.game = result;
            },
            (error) => {
                console.log('error');
                console.log('error: ' + error);
                this.game = null;
            }
        )
        return response;
    }

    async onClickButton(event : React.MouseEvent<HTMLButtonElement>) :Promise<void>{

        // stops the 'click' event
        event.preventDefault();
        event.stopPropagation();

        
        
        // check if game has already been created
        if(this.game){
            console.log('game already created');
            return;
        }
        
        // check if room url was entered
        if(this.state.roomUrl){
            await this.makeRequest();
        }
        
        // check if game creation was successful (if not: prevent propagation)
        if(this.game){
            console.log('redirect to waiting room');

            // redirects to the waiting room
            this.props.history?.push('waitingRoom');
        }
    }

    render(){
        const lastPathElement = this.props.match?.path.split("/")[this.props.match?.path.split("/").length - 2];
        const url = this.props.match?.url.split("/")[1]

        return(
            <div className="background-image">
                <div className="background-gradient">
                <h1>{this.props.title}</h1>
                <div className="buttons">
                    <InputRoom placeholder="Enter Room URL" handleChange={this.changeInputHandler}/>
                    <CustomButton className="green" title="Join Game" onHandle={(e) => this.onClickButton(e)} path={`${this.waitingRoomRoute}`}/>
                </div>  
                </div>
            </div>
        )
    }
}



