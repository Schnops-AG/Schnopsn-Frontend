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
    activeMembers: string[],
    readyToStart: boolean
}

type WaitingRoomRouteParams = {
    roomID: string
}

// Create button
export function WaitingRoom(props: WaitingRoomProps): JSX.Element {

    const match = useRouteMatch();
    console.log('waitingroom');

    return(
        <WaitingRoomUI match={match} {...props}></WaitingRoomUI>
    )
}

export class WaitingRoomUI extends React.Component<WaitingRoomProps, WaitingRoomState>{
    constructor(props: WaitingRoomProps){
        super(props);
        this.state = {activeMembers : this.extractMembersFromGame(), readyToStart : false};

        if(this.props.webSocket){
            this.props.webSocket.onReceiveMessage = this.onUpdateMembers.bind(this);
        }
    }

    extractMembersFromGame(): string[]{
        const players: string[][] = this.props.game.teams.map((team) => team.players.map((player) => player.playerName));
        console.log('players: ', players);
        return ([] as string[]).concat(...players);
    }

    onUpdateMembers(event: MessageEvent): void{
        console.log('update?');
        console.log(event.data);

        let names: string[] = event.data.split(';');
        names = names.filter((name) => name); // eliminate empty elements


        // set to state --> rerender
        const readyToStart: boolean = (names.length === this.props.game.maxNumberOfPlayers);
        this.setState({activeMembers : names, readyToStart: readyToStart}); // update members, readyToStart state

        console.log('ready after update?', readyToStart);
    }

    onStartGame(event: React.MouseEvent<HTMLButtonElement>){
        console.log('starting game...');
    }


    render(){

        console.log('ready?', this.state.readyToStart);
        

        const startButton :JSX.Element = 
        <div className="startGameButton">
            <CustomButton 
                title="Start Game"
                className={`green start ${this.state.readyToStart ? 'enabled' : 'disabled'}`}
                path={`./play`}
                onHandle={this.onStartGame}
                disabled={!this.state.readyToStart}
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

                        <div className="members">
                            {
                                this.state.activeMembers.map((member) =>(
                                    <p className="member" key={member}>{member}</p>
                                ))
                            }
                        </div>
    
                    </div>
                </div>
            </div>
        )
    }
}
