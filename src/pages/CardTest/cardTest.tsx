import { defaultCipherList } from "node:constants";
import React from "react"
import Board from "../../components/Board/Board";
import card from "../../components/Card/card";
import Card from "../../components/Card/card";
import Deck from "./CardLogic/deck";
import './cardTest.scss';


export function CardTest () : JSX.Element{

    const deck = new Deck();
    let p1 : JSX.Element[] = [];
    let p2 : JSX.Element[] = [];
    let stappel : JSX.Element[] = [];

    //Create full game Hand
   deck.shuffle();
    for(let i = 0; i < 5; i++){
        p1.push(<Card className={`card ${deck.cards[i].color}`}  id={i} draggable="true">{deck.cards[i].suit}, {deck.cards[i].value}</Card>);
        p2.push(<Card className={`card ${deck.cards[i+5].color}`} draggable="true">{deck.cards[i+5].suit}, {deck.cards[i+5].value}</Card>)
    }
    for(let i = 10; i < deck.cards.length; i++){
        stappel.push(<Card className={`card ${deck.cards[i].color}`} id={i} draggable="true">{deck.cards[i].suit}, {deck.cards[i].value}</Card>);
    }

    return (
        <div>
            <main className="flexbox">
                <Board id="board-1" className="board">
                    {p1}
                </Board>

                

                <Board id="board-3" className="board">
                    <div className="stappel">{stappel}</div>   
                </Board>

                <Board id="board-4" className="board">
                    {p2}
                </Board>
            </main>
        </div>
    )
}
