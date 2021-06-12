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
import { setTimeout } from 'timers'

/**
 * TOOD:
 * -----
 * - look at own stings (right bottom)
 * - get next card (from card stack)
 * - "zudrehen"
 * - "trumpf austauschen"
 * - (animation: who gets the sting)
 * - display opponent's stings (not showing of course) - area
 *   - (animation: opponnent drawing a card)
 * 
 * - everything necessary when a single round is over (eg. someone reached 66 points)
 * - what if the whole 'bummerl' is finished
 */



type PlayGroundProps = {
    webSocket?: CustomWebSocket,
}

type PlayGroundState = {
    myTurn: boolean,
    canDrawCard: boolean,

    playedCards: PlayCard[],
    currentCards: PlayCard[],

    stingFinished: boolean,
    countdown: number
    
}

export class Playground extends React.Component<PlayGroundProps, PlayGroundState> {
    // currentCards? :PlayCard[];
    game? :Game;
    player? :Player;
    playingLastCard :boolean = false;
    
    trumpCard? :PlayCard;
    currentPlayedCard? :PlayCard;
    
    newCard? :PlayCard;
    timerID :any;


    constructor(props: PlayGroundProps){
        super(props);

        this.timerID = 0;
        this.state = {
            myTurn : false, 
            playedCards : [], 
            currentCards : [], 
            canDrawCard : false, 
            stingFinished : false, 
            countdown : 5
        };
        
        if(this.props.webSocket){

            // set handler for receiving messages (websocket)
            this.props.webSocket.onReceiveMessage = this.onReceiveMessageFromWebSocket.bind(this);
        }
    }

    countdown = () =>{

        let seconds = this.state.countdown - 1;
        this.setState({countdown : seconds})

        if(this.state.countdown === 0){
            this.setState({playedCards : []}); // clear playedCards
            clearInterval(this.timerID);
        }
    }

    afterSting(){
        this.setState({stingFinished : true});
        this.timerID = setInterval(this.countdown, 1000);

    }

    /**
     * handles all messages received from the web socket
     * @param event 
     */
    async onReceiveMessageFromWebSocket(event: MessageEvent){

        // #region data-from-sessionScope

        // if game not set --> get game from sessionScope
        if(!this.game){
            let gameString = sessionStorage.getItem('game');
            if(gameString){
                this.game = JSON.parse(gameString);
                console.log(this.game);
            }
        }

        // if player not set --> get player from sessionScope
        if(!this.player){
            let playerString = sessionStorage.getItem('player');
            if(playerString){
                this.player = JSON.parse(playerString);
            }
        }
        // #endregion


        // #region receiving a message ...

        let message :Message = JSON.parse(event.data);

        // receive cards
        if(message.type === 'cards'){
            this.setState({currentCards : message.data});
            
            // set cards to sessionStorage to maintain state even after refresh
            sessionStorage.setItem('myCards', JSON.stringify(message.data)); 
        }

        // receive trump
        else if(message.type === 'trumpCard'){
            this.trumpCard = message.data;
            console.log('trump: ', this.trumpCard);
        }

        // receive info, if it is my turn to play
        else if(message.type === 'myTurn'){
            this.setState({myTurn : message.data});

            console.log('myturn:', this.state.myTurn);
        }

        // if opponent plays a card
        else if(message.type === 'playedCards'){
            console.log('playedCards: ', message.data);

            this.setState({playedCards : message.data});
        }

        else if(message.type === 'sting'){
            console.log('sting: ', message.data);

            this.afterSting();
        }

        else if(message.type === 'stingPoints'){
            console.log('stingPoints: ', message.data);
        }

        // player lost his sting (the other one is the winner)
        else if(message.type === 'winner'){
            console.log('winner: ', message.data);

            this.afterSting();
        }

        else if(message.type === 'bummerl'){
            console.log('bummerl: ', message.data);
        }

        else if(message.type === 'newCard'){
            console.log('newCard: ', message.data);
            this.newCard = message.data;
            this.setState({canDrawCard : true});
        }

        else if(message.type === 'winnerOfRound'){
            console.log('winnerOfRound: ', message.data);
        }

        else if(message.type === 'message'){
            console.log('message: ', message.data);
        }

        else{
            console.log(message);
        }

        // #endregion
    }


    getCurrentPlayedCard = () =>{
        return this.currentPlayedCard;
    }



    /**
     * handler that listens for a card to be played (dropped over the area in the middle of the screen)
     * @param card the card to be played
     */
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
                console.log(result, 'sucessfully played card?!!');

                // remove card
                let cards :PlayCard[] = this.state.currentCards;
                const index :number = cards.indexOf(card);
                cards = cards.filter(c => c != card);
                this.setState({currentCards : cards});
                
            },
            (error) => {
                console.log('error: ' + error);
            }
        )
    }


    onStartDrag = (card :PlayCard) =>{
        this.currentPlayedCard = card;
    }

    onDrawCard = (event :React.MouseEvent) =>{
        if(!this.state.canDrawCard){
            console.log('cannot draw a card yet. please wait.');
            return;
        }
        
        console.log('drawing card...');
        

        // update state of own cards (add new card)
        this.setState({canDrawCard : false});
        if(this.newCard){
            const cards = this.state.currentCards;
            cards.push(this.newCard);
            this.newCard = undefined;
            this.setState({currentCards : cards});
        }
    }

    render() {

        // get data from sessionStorage (after refresh)
        console.log('currentcards: ', this.state.currentCards);
        if(this.state.currentCards.length == 0 && !this.playingLastCard){
            let cardString = sessionStorage.getItem('myCards');
            if(cardString){
                console.log('getting cards from sessionStorage..');
                let cards :PlayCard[] = JSON.parse(cardString);
                
                this.playingLastCard = true; // to avoid (maybe) possible recursion
                this.setState({currentCards: cards});
            }
        }


        // construct list of indices for unique card-id's
        let cardIndices :number[] = [];
        if(this.state.currentCards){
            for(let i = 0; i < this.state.currentCards.length; i++){
                cardIndices.push(i);
            }
        }

        // construct list of indices for unique card-id's
        let playedCardIndices :number[] = [];
        if(this.state.playedCards){
            for(let i = 0; i < this.state.playedCards.length; i++){
                playedCardIndices.push(i);
            }
        }

        

        return (
            <div className="playground">
                <div className="back">

                    <div className="top">
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

                    </div>


                    {/* Main Area (Center) */}
                    <main className="main">

                        {/* middle area */}
                        <div className="central">

                            <div className="score">
                                <div className="h3">
                                    <h3>Spielstand</h3>
                                </div>  
                                <div className="points">
                                    <span id="opponent">1</span>
                                    <span id="me">3</span>

                                </div>
                            </div>

                            {
                                (this.state.stingFinished && this.state.countdown > 0) ? 
                                    <div className="cardVanishOverlay">
                                        <div>
                                            <p>{this.state.countdown}</p>
                                        </div>
                                    </div> 
                                : <></>
                            }
                            
                            <Board id="middle" 
                                getCard={this.getCurrentPlayedCard} 
                                playCard={this.onPlayCard} 
                                className="board">
                                {
                                    playedCardIndices.map(i => (
                                        <Card 
                                            className="card"  
                                            onDragStart={this.onStartDrag}
                                            id={`playedCard_${i}`} 
                                            key={i}
                                            onPlay={this.onPlayCard}
                                            playCard={this.state.playedCards[i]}
                                            draggable={false}>
                                                {this.state.playedCards[i].color}, {this.state.currentCards[i].value}, {this.state.currentCards[i].name}
                                        </Card>
                                    ))
                                }

                                {
                                    (playedCardIndices.length === 0) ? <p>drag your cards here ..</p> : <></>
                                }
                                
                            </Board>

                            <div className="cardStack">
                                <div className="sub">
                                    {/* <span>empty card stack</span> */}
                                    <div className={`card ${this.state.canDrawCard ? "drawingPossible" : "drawingNotPossible"}`} 
                                        onClick={this.onDrawCard}></div>
                                    <div className="card trump">
                                        {this.trumpCard?.color} {this.trumpCard?.name}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Own Card Area */}
                        <div className="own">
                            <Board id="own" 
                                getCard={this.getCurrentPlayedCard} 
                                playCard={this.onPlayCard} 
                                className="board">
                                {
                                    cardIndices.map(i => (
                                        <Card 
                                            onDragStart={this.onStartDrag}
                                            onPlay={this.onPlayCard}
                                            className={`card ${this.state.myTurn ? "" : "card_wait"}`}
                                            id={`ownCard_${i}`} 
                                            key={i}
                                            playCard={this.state.currentCards[i] ? this.state.currentCards[i] : {} as PlayCard}
                                            draggable={this.state.myTurn}>
                                                {this.state.currentCards[i].color}, {this.state.currentCards[i].value}, {this.state.currentCards[i].name}
                                        </Card>
                                    ))
                                }
                            </Board>

                            <div className="ownStings">
                                <div className="card"></div>
                            </div>
                        </div>
                    
                    </main>

                    
                </div>

                

            </div>
        )
    }
}

