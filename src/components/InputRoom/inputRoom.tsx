import React from 'react'
import './inputRoom.scss'
import {
  Link
} from "react-router-dom";

type InputRoomType = {
  placeholder: string
}

// Create button
export function InputRoom({placeholder}: InputRoomType): JSX.Element {
  return(
        <input className="input-field" type="text" placeholder={placeholder}></input>
    )
}


