import React from 'react'
import {
  Link, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Player } from '../../models/player';

type CreateGameProps = {
  title: string,
  player: Player
}

// Create button
export function CreateGame({title, player}: CreateGameProps): JSX.Element {
  const match = useRouteMatch();
  const lastPathElement: string = match.path.split("/")[match.path.split("/").length - 2];

  const setAdmin = (player: Player) =>{
    player.isAdmin = true;
    console.log("setAdmin: " + player.isAdmin);
  };

  return(
      <div className="background-image">
        <div className="background-gradient">
          <h1>{title}</h1>
          <div className="buttons">
              <InputRoom placeholder="Enter Name"/>
              <CustomButton className="green" title="Create Game" onCreate={() => setAdmin(player)} path={`/${lastPathElement}/waitingRoom`}/>
          </div>  
        </div>
      </div>
  )
}
