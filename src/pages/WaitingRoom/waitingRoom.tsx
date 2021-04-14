import React from 'react'
import {
  Link
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Player } from '../../models/player';

type WaitingRoomProps = {
  title: string,
  player: Player
}

// Create button
export function WaitingRoom({title, player}: WaitingRoomProps): JSX.Element {


    return(
        <div className="background-image">
          <div className="background-gradient">
            <h1>{title}</h1>
            <h2>waiting for others to join</h2>
            <div className="buttons">
                <InputRoom placeholder="Enter Name"/>
                <CustomButton className="green" title="Create Game" path="/" />
            </div>
            <p>admin? {player.isAdmin? 'true' : 'false'}</p>  

            {
              player.isAdmin 
                ? 
                  <div>
                    <h3>you are admin</h3>
                    <p>is really Admin? {JSON.stringify(player)}</p>
                  </div>
                :
                  <div>Test</div>

            }

          </div>
        </div>
    )
}
