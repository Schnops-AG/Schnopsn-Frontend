import './waitingRoom.scss';
import React from 'react'
import {
  match, useHistory, useRouteMatch
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { CustomInput } from '../../components/CustomInput/customInput';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { CustomWebSocket } from '../../utils/websocket';
import { Message } from '../../models/message';
import { History } from 'history';

type WaitingRoomProps = {
    title?: string,
    player: Player,
    match?: match<{}>,
    game: Game,
    webSocket?: CustomWebSocket,
    history?: History
}

type WaitingRoomState = {
    activeMembers: string[],
    readyToStart: boolean
}


// Create button
export function WaitingRoom(props: WaitingRoomProps): JSX.Element {

    const match = useRouteMatch();
    const history = useHistory();

    return(
        <WaitingRoomUI match={match} history={history} {...props}></WaitingRoomUI>
    )
}

export class WaitingRoomUI extends React.Component<WaitingRoomProps, WaitingRoomState>{
    
    constructor(props: WaitingRoomProps){
        super(props);
        this.state = {activeMembers : this.extractMembersFromGame(), readyToStart : false};

        if(this.props.webSocket){

            // set handler for receiving messages from websocket
            this.props.webSocket.onReceiveMessage = this.onReceiveMessage.bind(this);
        }
    }

    /**
     * a helper function, used to initially merge all players of the game into the 
     * list of activeMembers
     * @returns 
     */
    extractMembersFromGame(): string[]{
        const players: string[][] = this.props.game.teams.map((team) => team.players.map((player) => player.playerName));
        return ([] as string[]).concat(...players);
    }

    /**
     * handler for messages from the websocket
     * @param event 
     */
    onReceiveMessage(event: MessageEvent): void{
        let message :Message = JSON.parse(event.data);

        // if another player joins into the room -> receive list of "waiting" members
        if(message.type === 'join'){
            let names :string[] = message.data.split(';');
            this.onUpdateMembers(names);
        }

        // forward to playground
        if(message.type === 'forward'){
            this.props.history?.push(message.data); // forward to /play
        }
    }

    /**
     * will be called if new members join the room; 
     * displays all actively "waiting" members 
     *  (by updating the state 'activeMembers' which rerenders the page)
     * @param names list of names received from the websocket
     */
    onUpdateMembers = (names :string[]) =>{
        names = names.filter((name) => name); // eliminate empty elements

        // set to state --> rerender
        const readyToStart: boolean = (names.length === this.props.game.maxNumberOfPlayers);
        this.setState({activeMembers : names, readyToStart: readyToStart}); // update members, readyToStart state
    }

    /**
     * onClick handler for the 'StartGame' button (only for the admin)
     * makes a request to start the game --> /startRound2erSchnopsn
     */
    onStartGame = (event: React.MouseEvent<HTMLButtonElement>) =>{

        // request --> (POST) /startRound2erSchnopsn (gameID)
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };


        console.log('gametype: ', this.props.game.gameType);
        if(this.props.game.gameType === '_2ERSCHNOPSN'){
            // request
            fetch(`http://localhost:8080/api/v1/startRound2erSchnopsn?gameID=${this.props.game.gameID}`, requestOptions)
            .then(res => {
                console.log('result: ', res);
            })
        }else{
            // request
            fetch(`http://localhost:8080/api/v1/getCards4erSchnopsn?gameID=${this.props.game.gameID}`, requestOptions)
            .then(res => {
                console.log('result: ', res);
            })
        }
        
        

    }


    render(){

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
