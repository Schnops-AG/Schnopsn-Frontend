import React from 'react'
import {
  Link, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';

type CreateGameProps = {
  title: string,
}

// Create button
export function CreateGame({title}: CreateGameProps): JSX.Element {
  const match = useRouteMatch();
  const lastPathElement: string = match.path.split("/")[match.path.split("/").length - 2];

  return(
      <div className="background-image">
        <div className="background-gradient">
          <h1>{title}</h1>
          <div className="buttons">
              <InputRoom placeholder="Enter Name"/>
              <CustomButton className="green" title="Create Game" path={`/${lastPathElement}/waitingRoom`}/>
          </div>  
        </div>
      </div>
  )
}
