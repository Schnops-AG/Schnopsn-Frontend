import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, BrowserRouter, Link, useRouteMatch, useParams } from 'react-router-dom';
import { JoinGame } from '../JoinGame/joinGame';
import { CreateGame } from '../CreateGame/createGame';

type StartGameProps = {
  title: string,
}



// Load Title
export function StartGame({title}: StartGameProps): JSX.Element {
    /*Gibt mir den aktuellen Path zurück */
    const match = useRouteMatch();

    return(
        <Switch>

            {/* Route to JoinGame */}
            <Route path={`${match.path}/joinGame`}>
                <JoinGame title={title}/>
            </Route>

            {/* Route to CreateGame */}
            <Route path={`${match.path}/createGame`}>
                <CreateGame title={title}/>
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


