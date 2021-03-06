import React from 'react'
import './playground.scss'
import './playground_2erSchnopsn.scss'
import Board from '../../components/Board/Board'
import { CustomWebSocket } from '../../utils/websocket'
import { Message } from '../../models/message'
import { PlayCard } from '../../models/card'
import Card from '../../components/Card/card'
import { Game } from '../../models/game'
import { Player } from '../../models/player'
import { ErrorMessage } from '../../models/errorMessage'
import StingView from '../../components/StingView/stingView'
import InfoBoxComponent, { InfoBox } from '../../components/InfoBox/infoBox'
import { BASE_URL } from '../../utils/webthings'

/**
 * TOOD:
 * -----
 * - implement priority restrictions
 * - eigene Stiche anschauen (große Ansicht - pop up)
 * - Error/Info messages
 * - opponnent's cards if less than 5
 * - set current cards on sessionStorage
 * - (animation: who gets the sting)
 * - (animation: opponnent drawing a card)
 */



type PlayGroundProps = {
    webSocket?: CustomWebSocket,
}

type PlayGroundState = {
    myTurn: boolean,
    canDrawCard: boolean,
    drawCounter: number,

    playedCards: PlayCard[],
    myCards: PlayCard[],
    trumpCard: PlayCard,

    myStings: PlayCard[][],

    opponnentGotStings: boolean,

    stingFinished: boolean,
    totalStingPoints: number,
    countdown: number,
    countdown2040: number,

    zugedreht: boolean,

    errorMessages: ErrorMessage[],

    gameScore: Map<string, number>,
    bummerlScore: Map<string, number>,

    infoBox: InfoBox,

    call20: any,
    call40: any
    

    
}

export class Playground extends React.Component<PlayGroundProps, PlayGroundState> {
    // currentCards? :PlayCard[];
    game? :Game;
    player? :Player;
    opponentPlayer? :Player;
    playingLastCard :boolean = false;
    
    currentPlayedCard? :PlayCard;
    
    newCard? :PlayCard;
    timerID :any;
    timerCall2040 :any;


    constructor(props: PlayGroundProps){
        super(props);

        this.timerID = 0;

        this.state = {
            myTurn : false, 
            playedCards : [], 
            myCards : [], 
            myStings : [],
            opponnentGotStings : false,
            trumpCard : new PlayCard("", 1, "", "", false),
            canDrawCard : false, 
            drawCounter : 5,
            stingFinished : false, 
            totalStingPoints : 0,
            countdown : 3,
            countdown2040 : 5,
            errorMessages : [],
            zugedreht : false,
            gameScore : new Map<string, number>([['0', 1], ['1', 0]]),
            bummerlScore : new Map<string, number>([['0', 1], ['1', 0]]),
            infoBox : new InfoBox('none', '', ''),
            call20 : null,
            call40 : null
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
     * will be called every second to update the countdown (by -1 second)
     */
    _countdown2040 = () =>{

        let seconds = this.state.countdown2040 - 1;
        this.setState({countdown2040: seconds});

        if(this.state.countdown2040 <= 0){

            // clear playedCards, set countdown back to 5 seconds
            this.setState({call20 : null, call40 : null, countdown2040 : 5}); 
            clearInterval(this.timerCall2040);
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
                console.log('player: ', this.player?.playerName, this.player?.playerID);
            }
        }
        // #endregion


        // #region receiving a message ...

        let message :Message = JSON.parse(event.data);

        // receive cards
        if(message.type === 'cards'){
            console.log('cards:', message.data);
            this.setState({myCards : message.data});
            
            // set cards to sessionStorage to maintain state even after refresh
            sessionStorage.setItem('myCards', JSON.stringify(message.data)); 
        }

        // receive trump
        else if(message.type === 'trumpCard'){

            // reset totalStingsPoints
            this.setState({
                totalStingPoints : 0, 
                drawCounter : 5, 
                trumpCard : message.data,
                opponnentGotStings : false,
                zugedreht : false,
                myStings : []});
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

            const updatedStings = this.state.myStings;
            updatedStings.push(message.data);
            this.setState({myStings: updatedStings});
            console.log('myStings: ', this.state.myStings);

            this.afterSting();
        }

        // returns the players (own) sting score
        else if(message.type === 'stingScore'){
            console.log('stingScore: ', message.data);
            this.setState({totalStingPoints : message.data});
        }

        // returns the map of bummerl (key: playerID, value: number of bummerl)
        else if(message.type === 'bummerl'){
            console.log('bummerl: ', message.data);

            // update bummerlScore, gameScore, reset status of `zugedreht`, state if opponnent's stings should be displayed
            this.setState({
                bummerlScore : new Map(Object.entries(message.data)), 
                gameScore : new Map<string, number>([['0', 1], ['1', 0]]),
                zugedreht : false,
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

        // returns the newly available card to be drawn,
        // -> now the player is able to click on the card stack to draw a card
        else if(message.type === 'newCard'){
            console.log('newCard: ', message.data);
            this.newCard = message.data;
            this.setState({canDrawCard : true});
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

        // informs the player that somebody has `zugedreht`
        else if(message.type === 'zugedreht'){
            console.log('zugedreht: ', message.data);
            this.setState({zugedreht : true});
        }

        // if somebody has exchanged the trumpcard --> get the new trump card
        else if(message.type === 'newTrumpCard'){
            console.log('newTrumpCard: ', message.data);
            this.setState({trumpCard : message.data});
        }

        // if someone else calls a 20/40er
        else if(message.type === '20er'){
            console.log('20er: ', message.data);
            console.log(JSON.parse(message.data));
            this.timerCall2040 = setInterval(this._countdown2040, 1000);
            this.setState({call20 : JSON.parse(message.data)});

        }
        else if(message.type === '40er'){
            console.log('40er: ', message.data);
            this.timerCall2040 = setInterval(this._countdown2040, 1000);
            this.setState({call40 : JSON.parse(message.data)});
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
     * used to start a new round (only admin)
     */
    startNewRound = () =>{
        console.log('starting new round...');
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        
        // request
        fetch(`${BASE_URL}/startRound2erSchnopsn?gameID=${this.game?.gameID}`, requestOptions)
        .then(res => {
            console.log('result: ', res);
        });
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
            this.setState({
                myCards : this.state.myCards, 
                infoBox : new InfoBox("info", "Draw a card", "You need to draw a card before playing!")});
            return;
        }


        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ playerName: enteredPlayerName })
        };
        
        // request
        fetch(`${BASE_URL}/makeMoveByCall?gameID=${this.game?.gameID}&playerID=${this.player?.playerID}&color=${card.color}&value=${card.value}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result, 'sucessfully played card?!!');

                // remove card
                let cards :PlayCard[] = this.state.myCards;
                cards = cards.filter(c => c !== card);

                if(cards.length === 0){
                    this.playingLastCard = true;
                }

                console.log('-- cards after removing: ', cards);
                this.setState({myCards : cards});

                console.log('played card!');
                console.log('currentCards: ', this.state.myCards);
                
            },
            (error) => {
                console.log('error: ' + error);
            }
        )
    }

    /**
     * handler that listens for the 'zudrehen' button + makes the request to the server
     */
    onZuadrahn = () =>{
        console.log('zuahdrahn...');

        if(this.state.zugedreht){
            console.log('it is already zuadraht...');
            return;
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ playerName: enteredPlayerName })
        };

        fetch(`${BASE_URL}/zudrehen?gameID=${this.game?.gameID}&playerID=${this.player?.playerID}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result, 'sucessfully zudraht?!!');
            },
            (error) => {
                console.log('error: ' + error);
            }
        )


    }

    /**
     * handler that listens for the `20er` and `40er`button on the action menue
     * @param type 20 or 40
     */
    onCall20or40 = (type: number) =>{
        console.log('calling ' + type + ' ...');



        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };

        fetch(`${BASE_URL}/call20er40er?gameID=${this.game?.gameID}&playerID=${this.player?.playerID}&type=${type}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result, 'sucessfully called 20/40?!!');
            },
            (error) => {
                console.log('error (call 20/40): ' + error);
            }
        )
    }


    /**
     * handler for exchanging the trump card with a `Bube`
     * @returns 
     */
    onExchangeTrump = () =>{
        console.log('exchanging trump..');

        if(this.state.trumpCard?.value === 2){
            console.log('trump card cannot be exchanged!');
            return;
        }
        if(!this.state.canDrawCard){
            console.log('trump is no longer in this position');
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // body: JSON.stringify({ playerName: enteredPlayerName })
        };

        fetch(`${BASE_URL}/switchTrumpCard?gameID=${this.game?.gameID}&playerID=${this.player?.playerID}`, requestOptions)
        .then(res => res.json())
        .then(
            (result) => {
                console.log(result, 'sucessfully zudraht?!!');
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

    /**
     * handler for drawing a card (from own board --> middle board)
     * @param event 
     * @returns 
     */
    onDrawCard = (event :React.MouseEvent) =>{

        // check if the player is allowed to draw a card
        if(!this.state.canDrawCard){
            console.log('cannot draw a card yet. please wait.');
            return;
        }
        
        console.log('drawing card...');
        

        // update state of own cards (add new card)
        this.setState({canDrawCard : false, drawCounter : this.state.drawCounter - 1});
        if(this.newCard){
            const cards = this.state.myCards;
            cards.push(this.newCard);
            this.newCard = undefined;
            this.setState({myCards : cards});
        }
    }

    render() {

        // get data from sessionStorage (after refresh)
        // console.log('currentcards: ', this.state.currentCards);
        if(this.state.myCards.length === 0 && !this.playingLastCard){
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
                <div className="back2er">

                    {/* Top line: opponnent */}
                    <div className="top">

                        {/* opponnent's stings */}
                        <div className="stings">
                            {
                                this.state.opponnentGotStings ? 
                                    <>
                                        <div className="card crossed"></div>
                                        <div className="card show crossed"></div>
                                    </>
                                : <></>
                            }
                        </div>


                        {/* Opponent */}
                        <div className="opponent">
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>
                            <div className="card crossed"></div>


                            {
                                // info 20/40er
                                (this.state.call20 || this.state.call40) ?
                                    <div className="call">
                                        <div className="type">{this.state.call20 ? '20er' : '40er'}</div>
                                        <div className="color">
                                            {this.state.call20 ? this.state.call20['color'] : ''}
                                            {this.state.call40 ? this.state.call40['color'] : ''}
                                        </div>
                                    </div>
                                : <></>
                            }
                        </div>
                    </div>


                    {/* Main Area (Center) */}
                    <main className="main">

                        {/* middle area */}
                        <div className="central">

                            {/* current state of the game */}
                            <div className="score">
                                <div className="h3">
                                    <h3>Spielstand</h3>
                                </div>  

                                {/* bummerl go here ?? */}
                                <div className="points">
                                    <span id="opponent">{bummerlScore[1]}</span>
                                    <span id="me">{bummerlScore[0]}</span>
                                </div>

                                {/* gameScore (0-7) */}
                                <div className="points">
                                    <span id="opponent">{gameScore[1]}</span>
                                    <span id="me">{gameScore[0]}</span>
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
                                            draggable={false} />
                                    ))
                                }

                                {
                                    (playedCardIndices.length === 0) ? <p>drag your cards here ..</p> : <></>
                                }
                                
                            </Board>

                            {/* Main card stack (where you can draw single cards) */}
                            <div className="cardStack">
                                {
                                    (this.state.drawCounter > 0)
                                    ?
                                        <div className="sub">
                                            {/* hidden card */}
                                            <div className={`card ${this.state.canDrawCard ? "drawingPossible" : "drawingNotPossible"} crossed`} 
                                                onClick={this.onDrawCard}></div>
                                            
                                            {/* trump card */
                                                console.log("Aktuelle Trumpfkarte: ", this.state.trumpCard)
                                            }
                                                <Card 
                                                    className={`card trump ${this.state.zugedreht ? 'trump_notVisible crossed ' : ''}`} 
                                                    onDragStart={this.onStartDrag}
                                                    id="100069"
                                                    key="100069"
                                                    onPlay={() => {}}
                                                    playCard={this.state.trumpCard}
                                                    draggable={false}
                                                />
                                        </div>
                                    :<></>
                                }
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
                                    <p onClick={this.onZuadrahn}>Zudrehen</p>
                                    <p onClick={this.onExchangeTrump}>Trump austauschen</p>
                                    <p onClick={() => this.onCall20or40(20)}>20er</p>
                                    <p onClick={() => this.onCall20or40(40)}>40er</p>
                                </div>
                            </div>

                            {/* stack of own stings + points */}
                            <div className="ownStings">
                                {
                                    (this.state.totalStingPoints > 0)
                                    ?
                                        <>
                                            <div className="stings">
                                                <div className="card crossed"></div>
                                                <div className="card show crossed"></div>
                                            </div>
                                            <div className="info">Your Points <br /> (Σ stings)</div>
                                            <div className="points">{this.state.totalStingPoints}</div>
    
                                            <StingView stings={this.state.myStings}/>
                                        </>
                                    :
                                        <></>
                                }
                            </div>
                        </div>
                    </main>
                
                    {
                        this.state.infoBox.type === 'none' ? <></> : 
                            <InfoBoxComponent onClose={() => this.setState({infoBox : new InfoBox('none', '', '')})} title={this.state.infoBox.title} type={this.state.infoBox.type}>{this.state.infoBox.children}</InfoBoxComponent>
                    }

                
                </div>
            </div>
        )
    }
}

