import { render } from '@testing-library/react';
import { defaultCipherList } from 'node:constants';
import React from 'react'
import { PlayCard } from '../../models/card';
import Deck from '../../pages/CardTest/CardLogic/deck';

type CardProps = {
    id: string,
    draggable: boolean,
    playCard: PlayCard,
    className: string,

    children: React.ReactNode,
    

    onPlay: (playCard: PlayCard) => void
}

export default function Card(props: CardProps) {

    const dragStart = (e : any) => {
        const target = e.target;
        e.dataTransfer.setData('card_id', target.id);
        
    }

    const dragEnd = (e : any) =>{

        // TODO: check if card over correct board

        console.log('drag');
        props.onPlay(props.playCard);
    }

    const dragOver = (e : any) => {
        e.stopPropagation();
    }
    
    return (
        <div
            id={props.id}
            className={props.className}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
        >
            {props.playCard.color}, {props.playCard.value}, {props.playCard.name}
        </div>
    );
}
