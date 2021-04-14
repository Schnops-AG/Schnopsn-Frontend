import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, BrowserRouter, Link, useRouteMatch, useParams, match } from 'react-router-dom';
import { JoinGame } from '../JoinGame/joinGame';
import { CreateGame } from '../CreateGame/createGame';
import { WaitingRoom } from '../WaitingRoom/waitingRoom';
import { Player } from '../../models/player';
import { render } from '@testing-library/react';

type StartGameProps = {
    title: string,

    // match? ... optional
    match?: match<{}>
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
export class StartGameUI extends React.Component<StartGameProps> {
    
    player1: Player = {
        playername : "alex",
        playerID : "player00000",
        caller : false,
        active : true,
        isAdmin : false
    };


    constructor(props: StartGameProps){
        super(props);
    }


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
    
                {/* Default Route  */}
                <Route path={this.props.match?.path}>
                    <div className="background-image">
                        <div className="background-gradient">
                            <h1>{this.props.title}</h1>
                            <div className="buttons">
                                <CustomButton className="green" title="Join Game" path={`${this.props.match?.url}/joinGame`} />
                                <CustomButton className="green" title="Create Game" path={`${this.props.match?.url}/createGame`} />
                            </div>  
                        </div>
                    </div>
                </Route>
            </Switch>
        )
    }
}


