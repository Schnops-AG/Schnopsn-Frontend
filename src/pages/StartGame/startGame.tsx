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

type StartGameProps = {
    title: string,

    // match? ... optional
    match?: match<{}>
}

type StartGameState = {
    playerName: string,
    isLoading: boolean
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
    
    player1: Player = {
        playername : "alex",
        playerID : "player00000",
        caller : false,
        active : true,
        isAdmin : false
    };


    constructor(props: StartGameProps){
        super(props);
        this.state = {playerName : '', isLoading : false};
    }

    /**
     * listens for changes on the input field (-> InputRoom) and updates the state
     * @param value 
     */
    changeInputHandler = (value: string) =>{
        this.setState({playerName : value});
    }

    /**
     * handler for the buttons
     * when clicked: the current playerName (-> state) will be used for the post request
     *  that requests the player object
     */
    onClickBtn = () =>{

        this.setState({isLoading : true});
        let enteredPlayerName :String = this.state.playerName;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerName: enteredPlayerName })
        };

        fetch("http://localhost:8080/api/v1/createPlayer", requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                this.player1.playername = result['playername'];
                this.player1.active = result['active'];
                this.player1.caller = result['caller'];
                this.player1.playerID = result['playerid'];
                console.log(this.player1);
            },
            (error) => {
                console.log('error: ' + error);
            }
        )
    };


    render(){

        return(
            <Switch>

                
                {/* Route to JoinGame */}
                <Route path={`${this.props.match?.path}/joinGame`}>
                    <JoinGame title={this.props.title} player={this.player1} />
                </Route>
    
                {/* Route to CreateGame */}
                <Route path={`${this.props.match?.path}/createGame`}>
                    <CreateGame title={this.props.title} player={this.player1}/>
                </Route>
    
                {/* Route to WaitingRoom */}
                <Route path={`${this.props.match?.path}/waitingRoom`}>
                    <WaitingRoom title={this.props.title} player={this.player1}/>
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
                                <InputRoom placeholder="Player-Name" handleChange={this.changeInputHandler} />
                                <div className="buttons">
                                    <CustomButton id="join" className="green" title="Join Game" onHandle={this.onClickBtn} path={`${this.props.match?.url}/joinGame`} />
                                    <CustomButton id="create" className="green" title="Create Game" onHandle={this.onClickBtn} path={`${this.props.match?.url}/createGame`} />
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


