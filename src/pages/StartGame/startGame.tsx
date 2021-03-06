import React from 'react'
import './startGame.scss'
import { CustomButton } from '../../components/Button/button';
import { Route, Switch, useRouteMatch, match, useHistory } from 'react-router-dom';
import { History } from 'history';
import { JoinGame } from '../JoinGame/joinGame';
import { CreateGame } from '../CreateGame/createGame';
import { WaitingRoom } from '../WaitingRoom/waitingRoom';
import { Player } from '../../models/player';
import { CustomInput } from '../../components/CustomInput/customInput';
import { Game } from '../../models/game';
import { Team } from '../../models/team';
import { CustomWebSocket } from '../../utils/websocket';
import { Playground } from '../Playground/playground';
import InfoBoxComponent, { InfoBox } from '../../components/InfoBox/infoBox';
import {Playground_4erSchnopsn} from '../Playground/playground_4erSchnopsn';
import { BASE_URL } from '../../utils/webthings';

type StartGameProps = {
    title: string,

    // match? ... optional
    match?: match<{}>,
    history?: History,
    gameType: string
}

type StartGameState = {
    playerName: string,
    room: string, // name or link
    infoBox: InfoBox
}


// a wrapper
export function StartGame(props: StartGameProps): JSX.Element{
    /*Gibt mir den aktuellen Path zurück */
    const match = useRouteMatch();
    const history = useHistory();


    // ...props  = all remaining props
    return(
        <StartGameUI match={match} {...props}></StartGameUI>
    )
}


/**
 * the actual StartGame page
 */
export class StartGameUI extends React.Component<StartGameProps, StartGameState> {
    
    player1?: Player = undefined;
    joinGameRoute = '';
    createGameRoute = '';
    game?: Game = undefined;

    webSocket?: CustomWebSocket;

    constructor(props: StartGameProps){
        super(props);
        this.state = {playerName : '', room : '', infoBox : new InfoBox('none', '', '')};
    }

    /**
     * listens for changes on the input field (-> InputRoom) and updates the state
     * @param value 
     */
    changeInputHandler = (value: string) =>{

        const allowRouting = () =>{
            if(this.state.playerName){
                this.joinGameRoute = '/joinGame';
                this.createGameRoute = '/createGame';
            }else{
                this.joinGameRoute = '';
                this.createGameRoute = '';
            }
        }


        this.setState({playerName : value}, allowRouting);
    }

    
    changeRoomState = (room: string) =>{
        this.setState({room : room});
    }

    setGame = (game: Game) =>{
        this.game = game;
        this.forceUpdate();

        // set game to SessionScope
        sessionStorage.setItem('game', JSON.stringify(game));

        // set admin status of player
        this.game?.teams.forEach((team :Team) => team.players.forEach((player :Player) =>{
            if(this.player1?.playerID === player.playerID){
                this.player1.admin = player.admin;
                sessionStorage.setItem('player', JSON.stringify(this.player1));
            }
        }))
    }



    /**
     * handler for the buttons (join, create)
     * when clicked: the current playerName (-> state) will be used for the post request
     *  that requests the player object
     */
    async onClickBtn(event : React.MouseEvent<HTMLButtonElement>){
        // event.preventDefault();
        // event.stopPropagation();
        
        let enteredPlayerName :String = this.state.playerName;
        
        // check if playername was actually entered
        if(enteredPlayerName == null || enteredPlayerName.length === 0){
            console.log("playername is null");
            event.preventDefault();
            event.stopPropagation();

            this.player1 = undefined;

            this.setState({infoBox : new InfoBox("info", "Missing Playername", "Please enter a playername")});


            return;

        }else{
            this.player1 = {} as Player;
        }

        console.log(enteredPlayerName);
        
        // prepare request
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ playerName: enteredPlayerName })
        };
        
        // request
        fetch(`${BASE_URL}/createPlayer?playerName=${enteredPlayerName}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                if(this.player1 !== undefined){
                    this.player1.playerName = result['playerName'];
                    this.player1.active = result['active'];
                    this.player1.caller = result['caller'];
                    this.player1.playerID = result['playerID'];
                    this.player1.admin = result['admin'];

                    // set player to SessionScope
                    sessionStorage.setItem('player', JSON.stringify(this.player1));

                    // start websocket
                    this.webSocket = new CustomWebSocket(this.player1.playerID);

                }
            },
            (error) => {
                console.log('error: ' + error);
                this.player1 = undefined;
            }
        )

        if(!this.player1){
            console.log('preventing..');
            event.preventDefault();
            event.stopPropagation();
        }
        
    }


    render(){



        return(
            <Switch>
                
                <Route path={`${this.props.match?.path}/joinGame`}>
                    <JoinGame 
                        title={this.props.title} 
                        player={this.player1 ? this.player1 : {} as Player} 
                        gameID={this.game ? this.game.gameID : ''}
                        setGame={this.setGame} 
                        changeRoomState={this.changeRoomState} />
                </Route>

                <Route path={`${this.props.match?.path}/createGame`}>
                    <CreateGame 
                        title={this.props.title} 
                        player={this.player1 ? this.player1 : {} as Player} 
                        gameType={this.props.gameType} 
                        setGame={this.setGame}
                        changeRoomState={this.changeRoomState} />
                </Route>

                <Route path={`${this.props.match?.path}/waitingRoom`}>
                    <WaitingRoom title={this.props.title} 
                        player={this.player1 ? this.player1 : {} as Player} 
                        game={this.game ? this.game : {} as Game}
                        webSocket={this.webSocket}
                    />
                </Route>

                {/* Route to lobby */}
                <Route path={`${this.props.match?.path}/play`}>
                    {
                        (this.props.match?.path.includes('2erSchnopsn')) 
                        ? <Playground webSocket={this.webSocket} />
                        : <Playground_4erSchnopsn webSocket={this.webSocket} game={this.game}/>
                    }
                </Route>
 
    
                {/* Default Route  */}
                <Route path={this.props.match?.path}>
                    <div className="background-image">
                        <div className="background-gradient">
                            <h1>{this.props.title}</h1>
                            <div className="container">
                                <CustomInput className="" placeholder="Player-Name" handleChange={this.changeInputHandler} />
                                <div className="buttons">
                                    <CustomButton id="join" className="green" title="Join Game" onHandle={(e) => this.onClickBtn(e)} path={`${this.props.match?.url}${this.joinGameRoute}`} />
                                    <CustomButton id="create" className="green" title="Create Game" onHandle={(e) => this.onClickBtn(e)} path={`${this.props.match?.url}${this.createGameRoute}`} />
                                    <CustomButton id="test" className="green" title="Test" path={`${this.props.match?.url}/test`} />
                                </div>  
                            </div>
                            
                            {
                                this.state.infoBox.type === 'none' ? <></> : 
                                    <InfoBoxComponent onClose={() => this.setState({infoBox : new InfoBox('none', '', '')})} title={this.state.infoBox.title} type={this.state.infoBox.type}>{this.state.infoBox.children}</InfoBoxComponent>
                            }

                        </div>
                    </div>
                </Route>
            </Switch>
        )
    }
}

