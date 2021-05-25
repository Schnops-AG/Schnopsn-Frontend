import './waitingRoom.scss';
import React from 'react'
import {
  Link, match, useParams, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { CustomInput } from '../../components/CustomInput/customInput';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { CustomWebSocket } from '../../utils/websocket';

type WaitingRoomProps = {
    title?: string,
    player: Player,
    match?: match<{}>,
    game: Game
}

type WaitingRoomState = {
    
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


    
    // const webSocket: CustomWebSocket = new CustomWebSocket();
    // webSocket.connect();
    // webSocket.disconnect();


    const startButton :JSX.Element = 
        <div className="startGameButton">
            <CustomButton 
                title="Start Game"
                className="green start disabled"
                path="/"
                disabled={true}
            ></CustomButton>
        </div>

        

    

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
                    <p>admin? {player.admin? 'true' : 'false'}</p>  

                    {player.admin ? startButton : <div></div>}

                </div>
                {/* <button onClick={(e) => webSocket.disconnect()}>disconnect</button> */}
                {/* <button onClick={(e) => webSocket.connect()}>connect</button> */}
                {/* <button onClick={(e) => webSocket.sendMessage('clicked button')}>send</button> */}
            

            </div>
        </div>
    )
}

export class WaitingRoomUI extends React.Component<WaitingRoomProps, WaitingRoomState>{
    constructor(props: WaitingRoomProps){
        super(props);
        this.state = {}
    }
}
