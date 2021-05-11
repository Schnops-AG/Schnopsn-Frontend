import React from 'react'
import {
  Link, useRouteMatch, match
} from "react-router-dom";
import { CustomButton } from '../../components/Button/button';
import { InputRoom } from '../../components/InputRoom/inputRoom';
import { Player } from '../../models/player';

type JoinGameProps = {
  title: string,
  player: Player,
  gameID: string,
  match?: match<{}>,

  changeRoomState: (roomUrl: string) => void
}

type JoinGameState = {
    player: Player,
    roomUrl: string
}

export function JoinGame(props: JoinGameProps) :JSX.Element {
    const match = useRouteMatch();
    return (<JoinGameUI match={match} {...props}></JoinGameUI>)
}


export default class JoinGameUI extends React.Component<JoinGameProps, JoinGameState> {

    constructor(props: JoinGameProps){
        super(props);
        this.state = {player: props.player, roomUrl: ''};
    }

    changeInputHandler = (value: string) =>{
        this.setState({roomUrl: value});
        this.props.changeRoomState(this.state.roomUrl);
    }

    setAdmin = (player: Player) =>{
        player.isAdmin = false;
    }

    makeRequest = () =>{
        const requestOptions = {
            method: 'POST'
        };

        // localhost:8080/api/v1/createGame?gameType=_4ERSCHNOPSN&playerID=379ff129-2f72-4943-bd32-a69a3dd5446b
        let gameID :string = this.props.gameID;
        let url :string = `http://localhost:8080/api/v1/joinGame?gameID=${gameID}&playerID=${this.state.player.playerID}`;

        fetch(url, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log('result: ' + result);
            },
            (error) => {
                console.log('error: ' + error);
            }
        )
    }

    onClickButton = () =>{
        
        let enteredRoomUrl = this.state.roomUrl;
        if(enteredRoomUrl){
            this.makeRequest();
        }

    }

    render(){
        const lastPathElement = this.props.match?.path.split("/")[this.props.match?.path.split("/").length - 2];
        const url = this.props.match?.url.split("/")[1]

        return(
            <div className="background-image">
                <div className="background-gradient">
                <h1>{this.props.title}</h1>
                <div className="buttons">
                    <InputRoom placeholder="Enter Room URL" handleChange={this.changeInputHandler}/>
                    <CustomButton className="green" title="Join Game" onHandle={this.onClickButton} path={url + ""}/>
                </div>  
                </div>
            </div>
        )
    }
}





// // Create button
// export function JoinGame({title, player}: JoinGameProps): JSX.Element {
//   const match = useRouteMatch();
//   const lastPathElement: string = match.path.split("/")[match.path.split("/").length - 2];

//   return(
//       <div className="background-image">
//         <div className="background-gradient">
//           <h1>{title}</h1>
//           <div className="buttons">
//               <InputRoom placeholder="https://127.0.0.5/your-game-id"/>
//               <CustomButton className="green" title="Join Game" path={`/${lastPathElement}/waitingRoom`} />
//           </div>  
//         </div>
//       </div>
//   )
// }


