import React from 'react'
import './startGame.scss'
import {
  Link
} from "react-router-dom";

type StartGameProps = {
  title: string,
}



// Load Title
export function StartGame({title}: StartGameProps): JSX.Element {
  return(
    <div>
      <h1>{title}</h1>
    </div>
  )
}


