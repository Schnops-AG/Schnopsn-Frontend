import React from 'react'
import { PlayCard } from '../../models/card';
import './cardstyle.scss';

type CardProps = {
    id: string,
    draggable: boolean,
    playCard: PlayCard,
    className: string,

    // children: React.ReactNode,

    onPlay: (playCard: PlayCard) => void,
    onDragStart: (playCard: PlayCard) => void,
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const SUITS = ["♠", "♣", "♥", "♦"];
export const SUIT_NAMES = ["PICK", "KREUZ", "HERZ", "KARO"];

export const getSuit = (e : string) => {
    switch(e){
        case 'PICK':
            return SUITS[0];
        case 'KREUZ':
            return SUITS[1];
        case 'HERZ':
            return SUITS[2];
        case 'KARO':
            return SUITS[3];
        default:
            return '';
    }
}

export const getRealValue = (e : number) => {
    switch(e){
        case 11:
            return 'A';
        case 2:
            return 'B';
        case 3:
            return 'D';
        case 4:
            return 'K';
        case -1:
            return '';
        default:
            return e;
    }
}

export default function Card(props: CardProps) {

    const dragStart = (e : React.DragEvent<HTMLDivElement>) => {
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
          className={`card card-black ${props.className}`}
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
            onClick={props.onClick}
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
            className={`card card-red ${props.className}`}
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
            onDragEnd={dragEnd}
            onClick={props.onClick}
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
            className={props.className}
            onClick={props.onClick}
        />
    );
}