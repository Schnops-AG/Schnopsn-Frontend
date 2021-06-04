import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import './playground.scss'
import Board from '../../components/Board/Board'
import { CustomWebSocket } from '../../utils/websocket'
import { Message } from '../../models/message'
import { PlayCard } from '../../models/card'
import Card from '../../components/Card/card'

type PlayGroundProps = {
    webSocket?: CustomWebSocket
}

type PlayGroundState = {
    myTurn: boolean,
    
}

export class Playground extends React.Component<PlayGroundProps, PlayGroundState> {
    cards? :PlayCard[];
    trumpCard? :PlayCard;

    constructor(props: PlayGroundProps){

        super(props)
        this.state = {myTurn : false};
        
        

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


            if(this.state.myTurn){
                this.onMyTurn();
            }
        }

        console.log(message);
    }

    /**
     * will be called if the state of 'myTurn' changes to 'true'
     */
    onMyTurn(){

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
                                                draggable="true">
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

