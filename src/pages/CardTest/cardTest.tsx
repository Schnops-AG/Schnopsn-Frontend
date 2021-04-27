import React from "react"
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Board from "../../components/Board/Board";
import Card from "../../components/Card/card";
import Deck from "./CardLogic/deck";
import './cardTest.scss';


export function CardTest () : JSX.Element{
    const deck = new Deck();
    deck.shuffle();
    console.log(deck.cards);
    const cardSlot = document.querySelector('.card-container');
    cardSlot?.appendChild(deck.cards[1].getHTML());
    let y = 2;

    return (
        <div>
            <main className="flexbox">
                <Board id="board-1" className="board">
                    <Card id="card-1" className="card" draggable="true">
                        <div className="card-container"></div>                        
                    </Card>
                </Board>
                <Board id="board-2" className="board">
                    <Card nid="card-2" className="card" draggable="true">
                        <p >Card two</p>
                    </Card>
                </Board>
            </main>
        </div>
    )
}