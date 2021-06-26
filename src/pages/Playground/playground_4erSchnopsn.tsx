import React, { Component } from 'react'
import Board from '../../components/Board/Board'
import Card from '../../components/Card/card'
import InfoBoxComponent, { InfoBox } from '../../components/InfoBox/infoBox'
import StingView from '../../components/StingView/stingView'
import { PlayCard } from '../../models/card'
import { ErrorMessage } from '../../models/errorMessage'
import { Game } from '../../models/game'
import { Message } from '../../models/message'
import { Player } from '../../models/player'
import { CustomWebSocket } from '../../utils/websocket'
import './playground_4erSchnopsn.scss'

type PlayGround4erProps = {
    webSocket?: CustomWebSocket,
}

type PlayGround4erState = {
    myTurn: boolean,

    playedCards: PlayCard[],
    myCards: PlayCard[],
    trumpCard: PlayCard,

    ourStings: PlayCard[][],

    opponnentGotStings: boolean,

    stingFinished: boolean,
    ourTotalStingPoints: number,
    countdown: number,

    errorMessages: ErrorMessage[],

    gameScore: Map<string, number>,
    bummerlScore: Map<string, number>,

    infoBox: InfoBox
}


export class Playground_4erSchnopsn extends Component<PlayGround4erProps, PlayGround4erState> {

    game? :Game;
    player? :Player;
    playingLastCard :boolean = false;
    
    currentPlayedCard? :PlayCard;
    
    timerID :any;


    constructor(props: PlayGround4erProps){
        super(props);

        this.timerID = 0;
        this.state = {
            myTurn : false, 
            playedCards : [], 
            myCards : [], 
            ourStings : [],
            opponnentGotStings : false,
            trumpCard : new PlayCard("", 1, "", "", false),
            stingFinished : false, 
            ourTotalStingPoints : 0,
            countdown : 3,
            errorMessages : [],
            gameScore : new Map<string, number>([['0', 1], ['1', 0]]),
            bummerlScore : new Map<string, number>([['0', 1], ['1', 0]]),
            infoBox : new InfoBox('none', '', '')
        };
        
        if(this.props.webSocket){

            // set handler for receiving messages (websocket)
            this.props.webSocket.onReceiveMessage = this.onReceiveMessageFromWebSocket.bind(this);
        }
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
                console.log('player: ', this.player?.playerName, this.player?.playerID);
            }
        }
        // #endregion


        // #region receiving a message ...

        let message :Message = JSON.parse(event.data);

        // receive cards
        if(message.type === 'cards'){
            this.setState({myCards : message.data});
            
            // set cards to sessionStorage to maintain state even after refresh
            sessionStorage.setItem('myCards', JSON.stringify(message.data)); 
        }

        // receive trump
        else if(message.type === 'trumpCard'){

            // reset totalStingsPoints
            this.setState({
                ourTotalStingPoints : 0, 
                trumpCard : message.data,
                opponnentGotStings : false,
                ourStings : []});
            this.playingLastCard = false;
            

            console.log('trump: ', this.state.trumpCard);
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

        
        // player lost his sting (the other one is the winner)
        else if(message.type === 'winner'){
            console.log('winner: ', message.data);

            this.setState({opponnentGotStings : true});
            
            this.afterSting();
        }

        // returns the winner of the round (name)
        else if(message.type === 'winnerOfRound'){
            console.log('winnerOfRound: ', message.data);
            console.log('currentCards: ', this.state.myCards);
        }
        
        // returns the current sting (consiting of TWO cards; only if you are the winner)
        else if(message.type === 'sting'){
            console.log('sting: ', message.data);

            const updatedStings = this.state.ourStings;
            updatedStings.push(message.data);
            this.setState({ourStings: updatedStings});
            console.log('myStings: ', this.state.ourStings);

            this.afterSting();
        }

        // returns the players (own) sting score
        else if(message.type === 'stingScore'){
            console.log('stingScore: ', message.data);
            this.setState({ourTotalStingPoints : message.data});
        }

        // returns the map of bummerl (key: playerID, value: number of bummerl)
        else if(message.type === 'bummerl'){
            console.log('bummerl: ', message.data);

            // update bummerlScore, gameScore, reset status of `zugedreht`, state if opponnent's stings should be displayed
            this.setState({
                bummerlScore : new Map(Object.entries(message.data)), 
                gameScore : new Map<string, number>([['0', 1], ['1', 0]]),
                opponnentGotStings : false
            });
        }

        // returns the score of of the current game (0-7) as a map (key: playerID, value: number of bummerl)
        else if(message.type === 'gamescore'){
            console.log('gamescore: ', message.data);
            this.setState({gameScore : new Map(Object.entries(message.data))});

            console.log('isAdmin?:', this.player?.admin);
            if(this.player?.admin){
                this.startNewRound();
            }
        }


        // just a simple message (for debugging..)
        else if(message.type === 'message'){
            console.log('message: ', message.data);
        }


        // returns the priority of the player's cards (whether a card can be played or not)
        else if(message.type === 'priorityCards'){
            console.log('priorityCards: ', message.data);
            this.setState({myCards : message.data});
        }
        
        else{
            console.log(message);
        }

        // #endregion
    }


    /**
     * after each sting: reset state, start countdown
     */
    afterSting(){
        this.setState({stingFinished : true});
        this.timerID = setInterval(this.countdown, 1000);
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
     * used to start a new round (only admin)
     */
    startNewRound = () =>{
        console.log('starting new round... TODO');

    } 
    
    getCurrentPlayedCard = () =>{
        return this.currentPlayedCard;
    }

    /**
     * set currentPlayed card onDrag
     * @param card 
     */
    onStartDrag = (card :PlayCard) =>{
        this.currentPlayedCard = card;
    } 
    
    /**
     * handler that listens for a card to be played (dropped over the area in the middle of the screen)
     * @param card the card to be played
     */
    onPlayCard = (card :PlayCard) => {
        console.log('playing card... TODO');
    }    



    /**
     * handler that listens for the `20er` and `40er`button on the action menue
     * @param type 20 or 40
     */
    onCall20or40 = (type: number) =>{
        console.log('calling ' + type + ' ...');

    }


    render() {

        // get data from sessionStorage (after refresh)
        // console.log('currentcards: ', this.state.currentCards);
        if(this.state.myCards.length == 0 && !this.playingLastCard){
            let cardString = sessionStorage.getItem('myCards');
            if(cardString){
                console.log('getting cards from sessionStorage..');
                let cards :PlayCard[] = JSON.parse(cardString);
                
                this.playingLastCard = true; // to avoid (maybe) possible recursion
                this.setState({myCards: cards});
            }
        }


        // construct list of indices for unique card-id's
        let cardIndices :number[] = [];
        if(this.state.myCards){
            for(let i = 0; i < this.state.myCards.length; i++){
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

        
        
        const prepareScore = (scoreMap :Map<string, number>) =>{
            let scoreArray :number[] = [0,0];
            scoreMap.forEach((value :number, key :string) =>{
                if(this.player?.playerID === key){
                    scoreArray[0] = value;
                }else if(key.length > 1){
                    scoreArray[1] = value;
                }
            });
            return scoreArray;
        };
        
        let gameScore = prepareScore(this.state.gameScore);
        let bummerlScore = prepareScore(this.state.bummerlScore);

        return (
            <div className="playground">
                <div className="back4er">
                    {/* the top area with the player's mate and the points */}
                    <div className="top">
                        <div className="points">
                            <h3>Points</h3>
                        </div>
                        <div className="mate">
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                        </div>
                    </div>



                    {/* the middle area */}
                    <div className="central">
                        <div className="opponnent">
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                        </div>

                        {/* The very central area with the board */}
                        <div className="middle">
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
                                            draggable={false} />
                                    ))
                                }

                                {
                                    (playedCardIndices.length === 0) ? <p>drag your cards here ..</p> : <></>
                                }
                                
                            </Board>

                        </div>


                        <div className="opponnent">
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                        </div>

                    </div>





                    {/* Own Card Area */}
                    <div className="own">

                        {/* own cards */}
                        <Board id="own" 
                            getCard={this.getCurrentPlayedCard} 
                            playCard={this.onPlayCard} 
                            className="board">
                            {
                                cardIndices.map(i => (
                                    <Card 
                                        onDragStart={this.onStartDrag}
                                        onPlay={this.onPlayCard}
                                        className={`${this.state.myTurn && this.state.myCards[i].priority ? "" : "card_wait"}`}
                                        id={`ownCard_${i}`} 
                                        key={i}
                                        playCard={this.state.myCards[i] ? this.state.myCards[i] : {} as PlayCard}
                                        draggable={this.state.myTurn && this.state.myCards[i].priority} />
                                ))
                            }
                        </Board>

                        {/* The Action Menue */}
                        <div className="actionMenue">
                            <h3>Actions</h3>
                            <div className="actions">
                                <p onClick={() => this.onCall20or40(40)}>40er</p>
                                <p onClick={() => this.onCall20or40(40)}>20er</p>
                                <p>Gang</p>
                                <p>Bettler</p>
                                <p>Zehner</p>
                                <p>Bauer</p>
                            </div>
                        </div>

                        {/* stack of own stings + points */}
                        <div className="ownStings">
                            {
                                (this.state.ourTotalStingPoints > 0)
                                ?
                                    <>
                                        <div className="stings">
                                            <div className="card crossed"></div>
                                            <div className="card show crossed"></div>
                                        </div>
                                        <div className="info">Your Points <br /> (Σ stings)</div>
                                        <div className="points">{this.state.ourTotalStingPoints}</div>

                                        <StingView stings={this.state.ourStings}/>
                                    </>
                                :
                                    <></>
                            }
                        </div>
                    
                    </div>                  


                    {
                        this.state.infoBox.type === 'none' ? <></> : 
                            <InfoBoxComponent onClose={() => this.setState({infoBox : new InfoBox('none', '', '')})} title={this.state.infoBox.title} type={this.state.infoBox.type}>{this.state.infoBox.children}</InfoBoxComponent>
                    }

                
                </div>
            </div>
        )
    }
}
