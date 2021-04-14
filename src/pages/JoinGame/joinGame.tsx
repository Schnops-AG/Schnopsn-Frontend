import React from 'react'
import {
  Link, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Player } from '../../models/player';

type JoinGameProps = {
  title: string,
  player: Player
}

// Create button
export function JoinGame({title, player}: JoinGameProps): JSX.Element {
  const match = useRouteMatch();
  const lastPathElement: string = match.path.split("/")[match.path.split("/").length - 2];

  return(
      <div className="background-image">
        <div className="background-gradient">
          <h1>{title}</h1>
          <div className="buttons">
              <InputRoom placeholder="https://127.0.0.5/your-game-id"/>
              <CustomButton className="green" title="Join Game" path={`/${lastPathElement}/waitingRoom`} />
          </div>  
        </div>
      </div>
  )
}


