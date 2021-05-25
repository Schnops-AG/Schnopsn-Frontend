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
    game: Game,
    webSocket?: CustomWebSocket
}

type WaitingRoomState = {
    
}

type WaitingRoomRouteParams = {
    roomID: string
}

// Create button
export function WaitingRoom(props: WaitingRoomProps): JSX.Element {

    const match = useRouteMatch();
    console.log('waitingroom');
    console.log(props.game);
    const link :string = props.game.inviteLink;
    const parts = link.split('/');
    const path = parts[parts.length - 1];


    
    

    return(
        <WaitingRoomUI match={match} {...props}></WaitingRoomUI>
    )
}

export class WaitingRoomUI extends React.Component<WaitingRoomProps, WaitingRoomState>{
    constructor(props: WaitingRoomProps){
        super(props);
        this.state = {}
    }

    render(){

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
                    <h1>{this.props.title}</h1>
                    <div className="waitingRoom">
                        <h2>waiting for others to join ...</h2>
                        <div className="invite">
                            <span className="inviteOthers">Invite Others:</span>
                            <CustomInput 
                                className="invitationLink" 
                                placeholder="" 
                                value={this.props.game.inviteLink}
                                disabled={true}/>
                        </div>
                        <p>admin? {this.props.player.admin? 'true' : 'false'}</p>  
    
                        {this.props.player.admin ? startButton : <div></div>}
    
                    </div>
                </div>
            </div>
        )
    }
}
