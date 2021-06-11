import React from 'react'
import { PlayCard } from '../../models/card';

{/* <div id={props.id}
            onDrop={drop}
            onDragOver={dragOver}
            className={props.className}>
            {props.children } */}
type BoardProps = {
    id: string,
    className: string,

    children: React.ReactNode,

    playCard: (card: PlayCard) => void,
    getCard: () => PlayCard | undefined
}

export default function Board(props : BoardProps) {

    // Wenn wir wirklich etwas "fallen" lassen
    const drop = (e : any) => {

        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');

        const card = document.getElementById(card_id);
        if(card != null){
            card.style.display = 'block';
        }

        if(props.id === 'middle'){
            
            // get card
            const card: PlayCard | undefined = props.getCard();
            
            if(card){

                // play
                props.playCard(card);
            }
        }
    }

    // Wenn etwas über dem Board ist
    const dragOver = (e : any) => {
        e.preventDefault();
    }

    return (
        <div 
            id={props.id}
            onDrop={drop}
            onDragOver={dragOver}
            className={props.className}>
            {props.children }
        </div>
    )
}


{/* <Board>Der text hier drinnen ist das Child</Board> */}