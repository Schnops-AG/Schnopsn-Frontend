import { render } from '@testing-library/react';
import { defaultCipherList } from 'node:constants';
import React from 'react'
import { PlayCard } from '../../models/card';
import Deck from '../../pages/CardTest/CardLogic/deck';
import './cardstyle.scss';

type CardProps = {
    id: string,
    draggable: boolean,
    playCard: PlayCard,
    className: string,

    children: React.ReactNode,

    onPlay: (playCard: PlayCard) => void,
    onDragStart: (playCard: PlayCard) => void
}

const SUITS = ["♠", "♣", "♥", "♦"];

const getSuit = (e : string) => {
    switch(e){
        case 'PICK':
            return SUITS[0];
            break;
        case 'KREUZ':
            return SUITS[1];
            break;
        case 'HERZ':
            return SUITS[2];
            break;
        case 'KARO':
            return SUITS[3];
            break;
    }
}

const getRealValue = (e : number) => {
    switch(e){
        case 11:
            return 'A';
            break;
        case 2:
            return 'B';
            break;
        case 3:
            return 'D';
            break;
        case 4:
            return 'K';
            break;
        default:
            return e;
    }
}

export default function Card(props: CardProps) {

    const dragStart = (e : React.DragEvent<HTMLDivElement>) => {
        const target = e.target;
        // e.dataTransfer.setData('card_id', e.target);''

        // save card to --> playground (currentplayedcard)
        props.onDragStart(props.playCard);
        
    }

    const dragEnd = (e : React.DragEvent<HTMLDivElement>) => {
        console.log('drag');
    }

    const dragOver = (e : React.DragEvent<HTMLDivElement>) => {
        e.stopPropagation();
    }

    const Card = (props : any) => {
        if (props.suit === "KREUZ" || props.suit === "PICK") {
          return (
          <div
          className="card card-black"
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
          >
                <div className="card-tl">
                    <div className="card-value">{getRealValue(props.value)}</div>
                    <div className="card-suit">{getSuit(props.suit)}</div>
                </div>
                <h1>{getSuit(props.suit)}</h1>
                <div className="card-br">
                    <div className="card-value">{getRealValue(props.value)}</div>
                    <div className="card-suit">{getSuit(props.suit)}</div>
                </div>
        </div>);
        } else {
          return (
          <div
            className="card card-red"
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
        >
                <div className="card-tl">
                  <div className="card-value">{getRealValue(props.value)}</div>
                  <div className="card-suitW">{getSuit(props.suit)}</div>
                </div>
                <h1>{getSuit(props.suit)}</h1>
                <div className="card-br">
                    <div className="card-value">{getRealValue(props.value)}</div>
                    <div className="card-suit">{getSuit(props.suit)}</div>
                </div>
            </div>
            );
        }
      }
    
    return (
        <Card
            suit={props.playCard.color}
            value={props.playCard.value} 
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
        />
    );
}