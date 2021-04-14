import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, BrowserRouter, Link, useRouteMatch, useParams } from 'react-router-dom';
import { JoinGame } from '../JoinGame/joinGame';
import { CreateGame } from '../CreateGame/createGame';
import { WaitingRoom } from '../WaitingRoom/waitingRoom';
import { Player } from '../../models/player';

type StartGameProps = {
  title: string,
  
}



// Load Title
// export function StartGame({title}: StartGameProps): JSX.Element {
export function StartGame({title}: StartGameProps): JSX.Element {
    /*Gibt mir den aktuellen Path zurück */
    const match = useRouteMatch();

    const player1: Player = {
        playername : "alex",
        playerID : "player00000",
        caller : false,
        active : true,
        isAdmin : false
    };

    return(
        <Switch>

            {/* Route to JoinGame */}
            <Route path={`${match.path}/joinGame`}>
                <JoinGame title={title} player={player1} />
            </Route>

            {/* Route to CreateGame */}
            <Route path={`${match.path}/createGame`}>
                {JSON.stringify(player1)}
                <CreateGame title={title} player={player1}/>
            </Route>

            {/* Route to WaitingRoom */}
            <Route path={`${match.path}/waitingRoom`}>
                {JSON.stringify(player1)}
                <WaitingRoom title={title} player={player1}/>
            </Route>

            {/* Default Route  */}
            <Route path={match.path}>
                <div className="background-image">
                    <div className="background-gradient">
                        <h1>{title}</h1>
                        <div className="buttons">
                            <CustomButton className="green" title="Join Game" path={`${match.url}/joinGame`} />
                            <CustomButton className="green" title="Create Game" path={`${match.url}/createGame`} />
                        </div>  
                    </div>
                </div>
            </Route>
        </Switch>
    )
}


