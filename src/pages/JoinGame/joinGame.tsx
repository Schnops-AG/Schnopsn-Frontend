import React from 'react'
import {
  Link, useRouteMatch, match, useHistory
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { CustomInput } from '../../components/CustomInput/customInput';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { History } from 'history';


type JoinGameProps = {
  title: string,
  player: Player,
  gameID: string,
  match?: match<{}>,
  history?: History,

  changeRoomState: (roomUrl: string) => void,
  setGame: (game: Game) => void
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

    makeRequest() :Promise<void>{
        // "http://localhost:8080/e4e1dbcb-8293-4471-af51-8aa28e15b4f6"
        
        let enteredUrl = this.state.roomUrl;
        let urlParts = enteredUrl.split('/');
        let gameID = urlParts[urlParts.length - 1];
        
        
        let regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i // regex to match type uuid

        if(gameID.match(regex) == null){
            console.log('this is not a valid uuid');
            return Promise.resolve();
        }



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
                    <CustomInput 
                        className="input-room" 
                        placeholder="Enter Room URL" 
                        handleChange={this.changeInputHandler}
                    />
                    <CustomButton 
                        className="green" 
                        title="Join Game" 
                        onHandle={(e) => this.onClickButton(e)} 
                        path={`${this.waitingRoomRoute}`}
                    />
                </div>  
                </div>
            </div>
        )
    }
}



