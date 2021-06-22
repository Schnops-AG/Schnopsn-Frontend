import React from 'react'
import { PlayCard } from '../../models/card';
import Card from '../Card/card';
import './stingView.scss';


type StingViewProps = {
    stings: PlayCard[][]

}

export default function StingView(props: StingViewProps) {

    const card_indices = [1,2,3,4,5];


    return (
        <div className="stingView">
            {
                props.stings.map(sting =>(
                    <div className="sting">
                        {
                            sting.map(card =>(
                                <Card 
                                    id={`sting_${card.name}_${card.color}`} 
                                    draggable={false} 
                                    playCard={card}
                                    className="card"
                                    onPlay={() => null}
                                    onDragStart={() => null}
                                />
                            ))
                        }
                    </div>
                ))
            }
        </div>
    )
}
