import React from 'react'
import './createGame.scss'
import {
  Link
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';

type CreateGameProps = {
  title: string,
}

// Create button
export function CreateGame({title}: CreateGameProps): JSX.Element {
    return(
        <div className="background-image">
          <div className="background-gradient">
            <h1>{title}</h1>
            <div className="buttons">
                <CustomButton className="green" title="Create Game" path="/" />
            </div>  
          </div>
        </div>
    )
}


