import React from 'react'
import './startGame.scss'
import {
  Link
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';

type StartGameProps = {
  title: string,
}



// Load Title
export function StartGame({title}: StartGameProps): JSX.Element {
  return(
    <div className="background-image">
      <div className="background-gradient">
        <h1>{title}</h1>
        <div className="buttons">
            <CustomButton className="green" title="Join Game" path="/" />
            <CustomButton className="brown" title="Create Game" path="/" />
        </div>  
      </div>
    </div>
  )
}


