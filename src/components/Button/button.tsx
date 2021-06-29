import React from 'react'
import './button.scss'
import {
  Link
} from "react-router-dom";


type BtnValue = {
  id?: string,
  title: string,
  className: string,
  path: string,
  disabled?: boolean,

  // onHandle? ... the custom onCreate-Function is optional
  onHandle?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

// Create button
export function CustomButton({id, title, className, path, onHandle, disabled}: BtnValue): JSX.Element {

    return(
        <Link to={path}>
            <button id={id} 
                onClick={onHandle} 
                className={className}
                disabled={disabled}
            >{title}</button>
        </Link>
    )
}


