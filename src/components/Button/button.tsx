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

  // onCreate? ... the custom onCreate-Function is optional
  onCreate?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Create button
export function CustomButton({title, className, path, onCreate}: BtnValue): JSX.Element {

    return(
        <Link to={path}>
            <button onClick={onCreate} className={className}>{title}</button>
        </Link>
    )
}


