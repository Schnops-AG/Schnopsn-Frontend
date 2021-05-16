import './waitingRoom.scss';
import React from 'react'
import {
  Link, match, useParams, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { CustomInput } from '../../components/CustomInput/customInput';
import { Game } from '../../models/game';
import { Player } from '../../models/player';

type WaitingRoomProps = {
    title?: string,
    player: Player,
    match?: match<{}>,
    game: Game
}

type WaitingRoomRouteParams = {
    roomID: string
}

// Create button
export function WaitingRoom({title, player, match, game}: WaitingRoomProps): JSX.Element {

    match = useRouteMatch();
    console.log('waitingroom');
    console.log(game);
    const link :string = game.inviteLink;
    const parts = link.split('/');
    const path = parts[parts.length - 1];



    const startButton :JSX.Element = 
        <CustomButton 
            title="Start Game"
            className="green"
            path="/"
        ></CustomButton>

    

    return(
        <div className="background-image">
            <div className="background-gradient">
                <h1>{title}</h1>
                <div className="waitingRoom">
                    <h2>waiting for others to join ...</h2>
                    <div className="invite">
                        <span className="inviteOthers">Invite Others:</span>
                        <CustomInput 
                            className="invitationLink" 
                            placeholder="" 
                            value={game.inviteLink}
                            disabled={true}/>
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
        </div>
    )
}
