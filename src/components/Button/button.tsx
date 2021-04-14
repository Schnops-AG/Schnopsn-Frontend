import React from 'react'
import './button.scss'
import {
  Link
} from "react-router-dom";
import { Player } from '../../models/player';

type CreateFunction = (player: Player) => void;

type BtnValue = {
  title: string,
  className: string,
  path: string,
  createGame: Function
}

// Create button
export function CustomButton({title, className, path, createGame}: BtnValue): JSX.Element {


  return(
        <Link to={path}><button onClick={createGame} className={className}>{title}</button></Link>
    )
}


