import { render } from '@testing-library/react';
import { defaultCipherList } from 'node:constants';
import React from 'react'
import Deck from '../../pages/CardTest/CardLogic/deck';
import './card.scss';

export default function Card(props: any) {

    const dragStart = (e : any) => {
        const target = e.target;
        e.dataTransfer.setData('card_id', target.id);
    }

    const dragOver = (e : any) => {
        e.stopPropagation();
    }

    const switchSuit = (param : any) => {
        switch (param) {
            case "H":
                return "HEARTS";
            case "D":
                return "DIAMONDS";
            case "C":
                return "CLUBS";
            case "S":
                return "SPAIDS";
            default:
                break;
        }
    }

    const switchValue = (param : any) => {
        switch (param) {
            case "A":
                return "Ace";
            case "K":
                return "King";
            case "Q":
                return "Queen";
            case "J":
                return "Jack";
            case "T":
                return "Ten";
            default:
                break;
        }
    }
    
    return (
        <div
            id={props.id}
            draggable={props.draggable}
            onDragStart={dragStart}
            onDragOver={dragOver}
        >
            <div className="card">
                <div className="mark-up dark">{props.value}</div>
                <div className="content">
                    <h1>
                        {switchValue(props.value)}
                    </h1>
                    <h2><sup>OF</sup><span className="dark">
                        {switchSuit(props.suit)}
                    </span></h2>
                </div>
                <div className="mark-down dark">{props.value}</div>
            </div>
        </div>
    );
}
