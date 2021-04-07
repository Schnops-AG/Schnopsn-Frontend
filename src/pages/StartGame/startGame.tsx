import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, BrowserRouter, Link, useRouteMatch, useParams } from 'react-router-dom';
import { JoinGame } from '../JoinGame/joinGame';

type StartGameProps = {
  title: string,
  path: string
}



// Load Title
export function StartGame({title, path}: StartGameProps): JSX.Element {
    const match = useRouteMatch();
    return(
        <Switch>
            <Route path={`${match.path}/joinGame`}>
                <h1>joinGame: {match.path}/joinGame</h1>
            </Route>
            <Route path={`${match.path}/createGame`}>
                <h1>joinGame: {match.path}/createGame</h1>
            </Route>
            <Route path={match.path}>
                <div className="background-image">
                    <div className="background-gradient">
                        <h1>{title}</h1>
                        <h2>{match.path}, {match.url}</h2>
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


