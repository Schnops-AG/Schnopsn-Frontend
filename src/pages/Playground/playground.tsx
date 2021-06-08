import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './playground.scss'
import Board from '../../components/Board/Board'
import { CustomWebSocket } from '../../utils/websocket'
import { Message } from '../../models/message'
import { PlayCard } from '../../models/card'
import Card from '../../components/Card/card'
import { Game } from '../../models/game'
import { Player } from '../../models/player'

type PlayGroundProps = {
    webSocket?: CustomWebSocket,
}

type PlayGroundState = {
    myTurn: boolean,
    playedCards: PlayCard[]
    
}

export class Playground extends React.Component<PlayGroundProps, PlayGroundState> {
    cards? :PlayCard[];
    trumpCard? :PlayCard;
    game? :Game;
    player? :Player;

    constructor(props: PlayGroundProps){

        super(props)
        this.state = {myTurn : false, playedCards : []};
        
        
        

        console.log('here in playground');

        if(this.props.webSocket){

            // set handler for receiving messages (websocket)
            this.props.webSocket.onReceiveMessage = this.onReceiveMessageFromWebSocket.bind(this);
        }
    }

    /**
     * handles all messages received from the web socket
     * @param event 
     */
    onReceiveMessageFromWebSocket(event: MessageEvent){

        console.log('game-playground:', this.game);
        if(!this.game){
            let gameString = sessionStorage.getItem('game');
            console.log('gameString:', gameString);
            if(gameString){
                this.game = JSON.parse(gameString);
                console.log(this.game);
            }
        }
        console.log('game-playground:', this.game);

        console.log('player-playground:', this.player);
        if(!this.player){
            let playerString = sessionStorage.getItem('player');
            if(playerString){
                this.player = JSON.parse(playerString);
            }
        }
        console.log('player-playground:', this.player);




        console.log('onHandle message from websocket in playground');
        console.log(event.data);

        let message :Message = JSON.parse(event.data);

        // receive cards
        if(message.type === 'cards'){
            this.cards = message.data;
            
            // set cards to sessionStorage to maintain state even after refresh
            sessionStorage.setItem('myCards', JSON.stringify(message.data)); 
        }

        // receive trump
        if(message.type === 'trumpCard'){
            this.trumpCard = message.data;
        }

        // receive info, if it is my turn to play
        if(message.type === 'myTurn'){
            this.setState({myTurn : message.data});

            console.log('myturn:', this.state.myTurn);
            if(this.state.myTurn){
                this.onMyTurn();
            }
        }

        // if opponent plays a card
        if(message.type === 'playedCards'){
            console.log(message.data);

            this.setState({playedCards : message.data});
        }

        console.log(message);
    }

    /**
     * will be called if the state of 'myTurn' changes to 'true'
     */
    onMyTurn(){

    }

    onPlayCard = (card :PlayCard) => {
        console.log('playing card...');
        console.log(card);


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ playerName: enteredPlayerName })
        };
        
        // request
        fetch(`http://localhost:8080/api/v1/makeMoveByCall?gameID=${this.game?.gameID}&playerID=${this.player?.playerID}&color=${card.color}&value=${card.value}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result);

            },
            (error) => {
                console.log('error: ' + error);
            }
        )

       

    }

    render() {
        console.log('rendering playground');


        // get data from sessionStorage (after refresh)
        let cardString = sessionStorage.getItem('myCards');
        console.log(cardString);
        if(cardString){
            let cards :PlayCard[] = JSON.parse(cardString);
           this.cards = cards;
        }


        // construct list of indices for unique card-id's
        let cardIndices :number[] = [];
        if(this.cards){
            console.log('cards?');
            for(let i = 0; i < this.cards?.length; i++){
                cardIndices.push(i);
                
            }
        }

        // construct list of indices for unique card-id's
        let playedCardIndices :number[] = [];
        if(this.state.playedCards){
            console.log('cards?');
            for(let i = 0; i < this.state.playedCards.length; i++){
                playedCardIndices.push(i);
            }
        }
        

        return (
            <div className="playground">
                <div className="back">

                    <div className="bummerl">
                        <h3>Bummerl</h3>
                        <span>1:3</span>
                    </div>

                    {/* Opponent */}
                    <div className="opponent">
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                        <div className="card"></div>
                    </div>


                    <div className="points">
                        <h3>Spielstand</h3>
                        <span>1</span>
                        <span>3</span>
                    </div>

                    {/* Main Area (Center) */}
                    <main className="main">
                        <div className="central">
                            <div className="cardStack">
                                <div className="sub">
                                    <span>card stack goes here...</span>

                                </div>
                            </div>
                            <Board id="middle" className="board">
                                {
                                    playedCardIndices.map(i => (
                                        <div>
                                            <Card 
                                                className="card"  
                                                id={`playedCard_${i}`} 
                                                onPlay={this.onPlayCard}
                                                playCard={this.state.playedCards[i]}
                                                draggable={false}>
                                                    {this.state.playedCards[i].color}, {this.cards?.[i].value}, {this.cards?.[i].name}
                                            </Card>
                                        </div>
                                    ))
                                }
                                <p>drag your cards here ..</p>
                            </Board>
                        </div>

                        {/* Own Card Area */}
                        <div className="own">
                            <Board id="own" className="board">
                                {
                                    cardIndices.map(i => (
                                        <div>
                                            <Card 
                                                className="card"  
                                                id={`ownCard_${i}`} 
                                                onPlay={this.onPlayCard}
                                                playCard={this.cards?.[i] ? this.cards?.[i] : {} as PlayCard}
                                                draggable={this.state.myTurn}>
                                                    {this.cards?.[i].color}, {this.cards?.[i].value}, {this.cards?.[i].name}
                                            </Card>
                                        </div>
                                    ))
                                }
                            </Board>
                        </div>
                    </main>
                    
                </div>

                

            </div>
        )
    }
}

