import React from 'react'
import { PlayCard } from '../../models/card';


type BoardProps = {
    id: string,
    className: string,

    children: React.ReactNode,

    playCard: (card: PlayCard) => void,
    getCard: () => PlayCard | undefined
}

export default function Board(props : BoardProps) {

    // Wenn wir wirklich etwas "fallen" lassen
    const drop = (e : React.DragEvent) => {

        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');

        const card = document.getElementById(card_id);
        if(card != null){
            card.style.display = 'block';
        }

        if(e.currentTarget.classList.contains('board_onDragOver')){
            e.currentTarget.classList.remove('board_onDragOver');
        }

        // only if dropped over the central area
        if(props.id === 'middle'){
            
            // get card
            const card: PlayCard | undefined = props.getCard();
            console.log('dropping card:', card);
            
            if(card){

                // play
                props.playCard(card);
            }
        }
    }

    // Wenn etwas über dem Board ist
    const dragOver = (e : React.DragEvent) => {
        e.preventDefault();
        if(props.id === 'middle'){
            if(!e.currentTarget.classList.contains('board_onDragOver')){
                e.currentTarget.classList.add('board_onDragOver');
            }

        }
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
