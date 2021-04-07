import React from 'react'
import './button.scss'
import {
  Link
} from "react-router-dom";

type BtnValue = {
  title: string,
  className: string,
  path: string
}

// Create button
export function CustomButton({title, className, path}: BtnValue): JSX.Element {
  return(
    <Link to={path}><button className={className}>{title}</button></Link>
    )
}


