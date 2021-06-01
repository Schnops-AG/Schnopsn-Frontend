import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, BrowserRouter, Link, useRouteMatch, useParams, match } from 'react-router-dom';
import { JoinGame } from '../JoinGame/joinGame';
import { CreateGame } from '../CreateGame/createGame';
import { WaitingRoom } from '../WaitingRoom/waitingRoom';
import { Player } from '../../models/player';
import { render } from '@testing-library/react';
import { CustomInput } from '../../components/CustomInput/customInput';
import { CardTest } from '../CardTest/cardTest';
import { join } from 'node:path';
import { Game } from '../../models/game';
import { Team } from '../../models/team';
import { CustomWebSocket } from '../../utils/websocket';
import { Playground } from '../Playground/playground';

type StartGameProps = {
    title: string,

    // match? ... optional
    match?: match<{}>,
    gameType: string
}

type StartGameState = {
    playerName: string,
    room: string // name or link
}


// a wrapper
export function StartGame(props: StartGameProps): JSX.Element{
    /*Gibt mir den aktuellen Path zurück */
    const match = useRouteMatch();


    // ...props  = all remaining props
    return(
        <StartGameUI match={match} {...props}></StartGameUI>
    )
}


/**
 * the actual StartGame page
 */
export class StartGameUI extends React.Component<StartGameProps, StartGameState> {
    
    player1?: Player = undefined;
    joinGameRoute = '';
    createGameRoute = '';
    game?: Game = undefined;

    webSocket?: CustomWebSocket;


    constructor(props: StartGameProps){
        super(props);
        this.state = {playerName : '', room : ''};
    }

    /**
     * listens for changes on the input field (-> InputRoom) and updates the state
     * @param value 
     */
    changeInputHandler = (value: string) =>{

        const allowRouting = () =>{
            console.log('allow-routing?');
            if(this.state.playerName){
                this.joinGameRoute = '/joinGame';
                this.createGameRoute = '/createGame';
            }else{
                this.joinGameRoute = '';
                this.createGameRoute = '';
            }
        }


        this.setState({playerName : value}, allowRouting);
    }

    
    changeRoomState = (room: string) =>{
        this.setState({room : room});
    }

    setGame = (game: Game) =>{
        this.game = game;

        // set admin status of player
        this.game?.teams.forEach((team :Team) => team.players.forEach((player :Player) =>{
            if(this.player1?.playerID == player.playerID){
                this.player1.admin = player.admin;
            }
        }))
    }



    /**
     * handler for the buttons (join, create)
     * when clicked: the current playerName (-> state) will be used for the post request
     *  that requests the player object
     */
    async onClickBtn(event : React.MouseEvent<HTMLButtonElement>){
        
        console.log('allowed: ' + this.createGameRoute);
        console.log(event.currentTarget);
        
        let enteredPlayerName :String = this.state.playerName;
        
        // check if playername was actually entered
        if(enteredPlayerName == null || enteredPlayerName.length === 0){
            console.log("playername is null");
            event.preventDefault();
            event.stopPropagation();
            
            this.player1 = undefined;
            return;

        }else{
            this.player1 = {} as Player;
        }

        console.log(enteredPlayerName);
        
        // prepare request
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ playerName: enteredPlayerName })
        };
        
        // request
        fetch(`http://localhost:8080/api/v1/createPlayer?playerName=${enteredPlayerName}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(this.player1 != undefined){
                    this.player1.playerName = result['playerName'];
                    this.player1.active = result['active'];
                    this.player1.caller = result['caller'];
                    this.player1.playerID = result['playerID'];
                    this.player1.admin = result['admin'];

                    // start websocket
                    console.log(this.player1.playerID);
                    this.webSocket = new CustomWebSocket(this.player1.playerID);

                }
                console.log('player after request: ');
                console.log(this.player1);

            },
            (error) => {
                console.log('error: ' + error);
                this.player1 = undefined;
            }
        )

        if(!this.player1){
            console.log('preventing..');
            event.preventDefault();
            event.stopPropagation();
        }
        
    }


    render(){

        return(
            <Switch>
                
                <Route path={`${this.props.match?.path}/joinGame`}>
                    <JoinGame 
                        title={this.props.title} 
                        player={this.player1 ? this.player1 : {} as Player} 
                        gameID={this.game ? this.game.gameID : ''}
                        setGame={this.setGame} 
                        changeRoomState={this.changeRoomState} />
                </Route>

                <Route path={`${this.props.match?.path}/createGame`}>
                    <CreateGame 
                        title={this.props.title} 
                        player={this.player1 ? this.player1 : {} as Player} 
                        gameType={this.props.gameType} 
                        setGame={this.setGame}
                        changeRoomState={this.changeRoomState} />
                </Route>

                <Route path={`${this.props.match?.path}/waitingRoom`}>
                    <WaitingRoom title={this.props.title} 
                        player={this.player1 ? this.player1 : {} as Player} 
                        game={this.game ? this.game : {} as Game}
                        webSocket={this.webSocket}
                    />
                </Route>

                {/* Route to lobby */}
                <Route path={`${this.props.match?.path}/play`}>
                    <Playground />
                </Route>
 

                {/* Route to test */}
                <Route path={`${this.props.match?.path}/test`}>
                    <CardTest />
                </Route>
    
                {/* Default Route  */}
                <Route path={this.props.match?.path}>
                    <div className="background-image">
                        <div className="background-gradient">
                            <h1>{this.props.title}</h1>
                            <div className="container">
                                <CustomInput className="" placeholder="Player-Name" handleChange={this.changeInputHandler} />
                                <div className="buttons">
                                    <CustomButton id="join" className="green" title="Join Game" onHandle={(e) => this.onClickBtn(e)} path={`${this.props.match?.url}${this.joinGameRoute}`} />
                                    <CustomButton id="create" className="green" title="Create Game" onHandle={(e) => this.onClickBtn(e)} path={`${this.props.match?.url}${this.createGameRoute}`} />
                                    <CustomButton id="test" className="green" title="Test" path={`${this.props.match?.url}/test`} />
                                </div>  
                            </div>
                            
                        </div>
                    </div>
                </Route>
            </Switch>
        )
    }
}

