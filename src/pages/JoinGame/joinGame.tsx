import React from 'react'
import './joinGame.scss'
import {
  Link
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';

type JoinGameProps = {
  title: string,
  path: string
}

// Create button
export function JoinGame({title, path}: JoinGameProps): JSX.Element {
    return(
        <div className="background-image">
          <div className="background-gradient">
            <h1>{title}</h1>
            <div className="buttons">
                <CustomButton className="green" title="Join Game" path="/" />
            </div>  
          </div>
        </div>
    )
}


