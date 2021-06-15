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
import { ErrorMessage } from '../../models/errorMessage'

/**
 * TOOD:
 * -----
 * - Stapel verschwinden lassen if empty
 * - eigene Stiche anschauen (große Ansicht - pop up)
 * - "zudrehen"
 * - "trumpf austauschen"
 * - (animation: who gets the sting)
 * - (animation: opponnent drawing a card)
 * - Error/Info messages
 */



type PlayGroundProps = {
    webSocket?: CustomWebSocket,
}

type PlayGroundState = {
    myTurn: boolean,
    canDrawCard: boolean,
    drawCounter: number,

    playedCards: PlayCard[],
    currentCards: PlayCard[],

    stingFinished: boolean,
    totalStingPoints: number,
    countdown: number,

    errorMessages: ErrorMessage[],

    
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
            drawCounter : 5,
            stingFinished : false, 
            totalStingPoints : 0,
            countdown : 3,
            errorMessages : []
        };
        
        if(this.props.webSocket){

            // set handler for receiving messages (websocket)
            this.props.webSocket.onReceiveMessage = this.onReceiveMessageFromWebSocket.bind(this);
        }
    }

    /**
     * will be called every second to update the countdown (by -1 second)
     */
    countdown = () =>{

        let seconds = this.state.countdown - 1;
        this.setState({countdown : seconds})

        if(this.state.countdown <= 0){

            // clear playedCards, set countdown back to 5 seconds
            this.setState({playedCards : [], countdown : 3, stingFinished : false}); 
            clearInterval(this.timerID);
        }
    }

    /**
     * after each sting: reset state, start countdown
     */
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

            // reset totalStingsPoints
            this.setState({totalStingPoints : 0, drawCounter : 5});
            

            console.log('trump: ', this.trumpCard);
        }

        // receive info, if it is my turn to play
        else if(message.type === 'myTurn'){
            console.log('myturn:', this.state.myTurn);
            this.setState({myTurn : message.data});

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

        else if(message.type === 'stingScore'){
            console.log('stingScore: ', message.data);
            this.setState({totalStingPoints : message.data});
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
            console.log('currentCards: ', this.state.currentCards);
        }

        else if(message.type === 'message'){
            console.log('message: ', message.data);
        }

        else if(message.type === 'gamescore'){
            console.log('gamescore: ', message.data);
        }

        else if(message.type === 'priorityCards'){
            console.log('priorityCards: ', message.data);
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

        if(this.state.canDrawCard){
            console.log('please draw a card first!!!'); // TODO
            this.setState({currentCards : this.state.currentCards}); // reset cards if not possible
            return;
        }


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

                console.log('-- cards after removing: ', cards);
                this.setState({currentCards : cards});

                console.log('played card!');
                console.log('currentCards: ', this.state.currentCards);
                
            },
            (error) => {
                console.log('error: ' + error);
            }
        )
    }


    /**
     * set currentPlayed card onDrag
     * @param card 
     */
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
        this.setState({canDrawCard : false, drawCounter : this.state.drawCounter - 1});
        if(this.newCard){
            const cards = this.state.currentCards;
            cards.push(this.newCard);
            this.newCard = undefined;
            this.setState({currentCards : cards});
        }
    }

    render() {

        // get data from sessionStorage (after refresh)
        // console.log('currentcards: ', this.state.currentCards);
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

                    {/* Top line: opponnent */}
                    <div className="top">

                        {/* opponnent's stings */}
                        <div className="stings">
                            <div className="card crossed"></div>
                            <div className="card show crossed"></div>
                        </div>


                        {/* Opponent */}
                        <div className="opponent">
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                        </div>

                        {/* Number of bummerl */}
                        <div className="bummerl">
                            <h3>Bummerl</h3>
                            <span>-1:-1</span>
                        </div>
                    </div>


                    {/* Main Area (Center) */}
                    <main className="main">

                        {/* middle area */}
                        <div className="central">

                            {/* current state of the game (points (0-7)) */}
                            <div className="score">
                                <div className="h3">
                                    <h3>Spielstand</h3>
                                </div>  
                                <div className="points">
                                    <span id="opponent">-1</span>
                                    <span id="me">-1</span>
                                </div>
                            </div>

                            {
                                // overlay for countdown
                                (this.state.stingFinished && this.state.countdown > 0) ? 
                                    <div className="cardVanishOverlay">
                                        <div>
                                            <p>{this.state.countdown}</p>
                                        </div>
                                    </div> 
                                : <></>
                            }
                            
                            {/* main board where cards can be dropped */}
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
                                                {this.state.playedCards[i].color}, {this.state.playedCards[i].value}, {this.state.playedCards[i].name}
                                        </Card>
                                    ))
                                }

                                {
                                    (playedCardIndices.length === 0) ? <p>drag your cards here ..</p> : <></>
                                }
                                
                            </Board>

                            {/* Main card stack (where you can draw single cards) */}
                            {
                                (this.state.drawCounter > 0)
                                ?
                                    <div className="cardStack">
                                        <div className="sub">
                                            {/* hidden card */}
                                            <div className={`card ${this.state.canDrawCard ? "drawingPossible" : "drawingNotPossible"} crossed`} 
                                                onClick={this.onDrawCard}></div>
                                            
                                            {/* trump card */}
                                            <div className="card trump">
                                                {this.trumpCard?.color} {this.trumpCard?.name}
                                            </div>
                                        </div>
                                    </div>
                                :<></>
                            }
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

                            {/* The Action Menue */}
                            <div className="actionMenue">
                                <h3>Actions</h3>
                                <div className="actions">
                                    <p>Zudrehen</p>
                                    <p>Trump austauschen</p>
                                    <p>20er/40er</p>
                                </div>
                            </div>

                            {/* stack of own stings + points */}
                            {
                                (this.state.totalStingPoints > 0)
                                ?
                                    <div className="ownStings">
                                        <div className="stings">
                                            <div className="card crossed"></div>
                                            <div className="card show crossed"></div>
                                        </div>
                                        <div className="info">Your Points <br /> (Σ stings)</div>
                                        <div className="points">{this.state.totalStingPoints}</div>
                                    </div>
                                :
                                    <></>
                            }
                        </div>
                    </main>
                </div>
            </div>
        )
    }
}

