import React from 'react'
import './button.scss'
import {
  Link
} from "react-router-dom";
import { Player } from '../../models/player';

type CreateFunction = (player: Player) => void;

type BtnValue = {
  id?: string,
  title: string,
  className: string,
  path: string,

  // onHandle? ... the custom onCreate-Function is optional
  onHandle?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Create button
export function CustomButton({id, title, className, path, onHandle}: BtnValue): JSX.Element {

    return(
        <Link to={path}>
            <button id={id} onClick={onHandle} className={className}>{title}</button>
        </Link>
    )
}


