import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, BrowserRouter, Link, useRouteMatch, useParams, match } from 'react-router-dom';
import { JoinGame } from '../JoinGame/joinGame';
import { CreateGame } from '../CreateGame/createGame';
import { WaitingRoom } from '../WaitingRoom/waitingRoom';
import { Player } from '../../models/player';
import { render } from '@testing-library/react';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { CardTest } from '../CardTest/cardTest';
import { join } from 'node:path';

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
            if(this.state.playerName){
                this.joinGameRoute = '/joinGame';
                this.createGameRoute = '/createGame';
            }else{
                this.joinGameRoute = '';
                this.createGameRoute = '';
            }
            console.log('playername: ' + this.state.playerName);
            console.log('value: ' + value);
            console.log('changing: join, create-gameRoute: ' + this.joinGameRoute + ", " + this.createGameRoute);
            console.log(this.state);
        }


        this.setState({playerName : value}, allowRouting);
    }

    

    changeRoomState = (roomName: string) =>{
        this.setState({room : roomName});
    }

    /**
     * handler for the buttons
     * when clicked: the current playerName (-> state) will be used for the post request
     *  that requests the player object
     */
    onClickBtn = () =>{
        console.log('click');

        let enteredPlayerName :String = this.state.playerName;

        // check if playername was actually entered
        if(enteredPlayerName == null || enteredPlayerName.length === 0){
            console.log("playername is null");
            this.player1 = undefined;
            return;
        }else{
            this.player1 = {} as Player;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: enteredPlayerName })
        };

        fetch("http://localhost:8080/api/v1/createPlayer", requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(this.player1 != undefined){
                    this.player1.playername = result['playername'];
                    this.player1.active = result['active'];
                    this.player1.caller = result['caller'];
                    this.player1.playerID = result['playerid'];
                }
                console.log('player after request: ');
                console.log(this.player1);
            },
            (error) => {
                console.log('error: ' + error);
                this.player1 = {} as Player;
            }
        )
    };


    render(){

        let routeJoinGame = null;
        let routeCreateGame = null;
        let routeWaitingRoom = null;
        

        // only enable routes, if player has already been already created
        if(this.player1){

            routeJoinGame = <Route path={`${this.props.match?.path}/joinGame`}>
                                <JoinGame title={this.props.title} player={this.player1} />
                            </Route>

            routeCreateGame =   <Route path={`${this.props.match?.path}/createGame`}>
                                    <CreateGame title={this.props.title} player={this.player1} gameType={this.props.gameType} changeRoomState={this.changeRoomState} />
                                </Route>


            // TODO: check for {url -> normal user | room-name -> admin}
            console.log('room-state: ' + (this.state.room ? 'tttrueee' : 'ffaaallsseee'));
            if(this.state.room){
                routeWaitingRoom =  <Route path={`${this.props.match?.path}/waitingRoom`}>
                                        <WaitingRoom title={this.props.title} player={this.player1}/>
                                    </Route>
            }
        }

        console.log('join, create-gameRoute: ' + this.joinGameRoute + ", " + this.createGameRoute);

        return(
            <Switch>

                {
                    // Route to JoinGame
                    routeJoinGame != null && routeJoinGame
                }

                {
                    // Route to CreateGame
                    routeCreateGame != null && routeCreateGame
                }
                

                {
                    // Route to WaitingRoom
                    routeWaitingRoom != null && routeWaitingRoom
                }
 

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
                                <InputRoom placeholder="Player-Name" handleChange={this.changeInputHandler} />
                                <div className="buttons">
                                    <CustomButton id="join" className="green" title="Join Game" onHandle={this.onClickBtn} path={`${this.props.match?.url}${this.joinGameRoute}`} />
                                    <CustomButton id="create" className="green" title="Create Game" onHandle={this.onClickBtn} path={`${this.props.match?.url}${this.createGameRoute}`} />
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

