import { defaultCipherList } from "node:constants";
import React from "react"
import Board from "../../components/Board/Board";
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
   let i = 0;
   deck.cards.map(c => {
        stappel.push(<Card id={i} draggable="true" suit={c.suit} value={c.value}/>)
        i++;
   })

    return (
        <div>
            <main className="flexbox">
                <Board id="board-1" className="board">
                </Board>
                
                <div className="middle-line">
                    <Board id="board-2" className="board left">
                        <div className="stappel"></div>   
                    </Board>

                    <Board id="board-3" className="board right">
                        {stappel}
                    </Board>
                </div>

                <Board id="board-4" className="board">
                </Board>
            </main>
        </div>
    )
}
