import React from "react"
import { DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import Board from "../../components/Board/Board";
import Card from "../../components/Card/card";
import './cardTest.scss';

export function CardTest () : JSX.Element{
    return (
        <div>
            <main className="flexbox">
                <Board id="board-1" className="board">
                    <Card id="card-1" className="card" draggable="true">
                        <p >Card one</p>
                    </Card>
                </Board>
                <Board id="board-2" className="board">
                    <Card id="card-2" className="card" draggable="true">
                        <p >Card two</p>
                    </Card>
                </Board>
            </main>
        </div>
    )
}