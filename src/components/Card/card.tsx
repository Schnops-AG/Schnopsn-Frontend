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

    const dragStart = (e : React.DragEvent<HTMLDivElement>) => {
        const target = e.target;
        // e.dataTransfer.setData('card_id', e.target);''
        
    }

    const dragEnd = (e : React.DragEvent<HTMLDivElement>) => {

        // TODO: check if card over correct board
        console.log('target:', e.currentTarget.parentElement?.parentElement);

        console.log('drag');


        props.onPlay(props.playCard);
    }

    const dragOver = (e : React.DragEvent<HTMLDivElement>) => {
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
