import React from 'react'
import {
  Link
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';

type WaitingRoomProps = {
  title: string,
  isAdmin: boolean
}

// Create button
export function WaitingRoom({title, isAdmin}: WaitingRoomProps): JSX.Element {
    return(
        <div className="background-image">
          <div className="background-gradient">
            <h1>{title}</h1>
            <h2>waiting for others to join</h2>
            <div className="buttons">
                <InputRoom placeholder="Enter Name"/>
                <CustomButton className="green" title="Create Game" path="/" />
            </div>  

            if(isAdmin){
                <h3>you are admin</h3>
            }

          </div>
        </div>
    )
}
