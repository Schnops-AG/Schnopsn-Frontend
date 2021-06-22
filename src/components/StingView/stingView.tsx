import React from 'react'
import { PlayCard } from '../../models/card';
import Card from '../Card/card';
import './stingView.scss';

export default function StingView() {

    const card_indices = [1,2,3,4,5];


    return (
        <div className="stingView">
            {
                card_indices.map(i => (
                    <div className="sting">
                        <Card 
                            id={``} 
                            draggable={false} 
                            // TODO: playcard
                            playCard={{} as PlayCard}
                            className="card"
                            onPlay={() => null}
                            onDragStart={() => null}
                        >

                        </Card>
                        <Card 
                            id='string_0' 
                            draggable={false} 
                            // TODO: playcard
                            playCard={{} as PlayCard}
                            className="card"
                            onPlay={() => null}
                            onDragStart={() => null}
                        >

                        </Card>
                    </div>

                ))
            }
        </div>
    )
}
