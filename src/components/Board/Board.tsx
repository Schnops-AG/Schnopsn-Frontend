import React from 'react'

export default function Board(props : any) {
    // Wenn wir wirklich etwas "fallen" lassen
    const drop = (e : any) => {
        e.preventDefault();
        const card_id = e.dataTransfer.getData('card_id');

        const card = document.getElementById(card_id);
        if(card != null){
            card.style.display = 'block';
        }

        e.target.appendChild(card);

    }

    // Wenn etwas über dem Board ist
    const dragOver = (e : any) => {
        e.preventDefault();
    }

    return (
        <div id={props.id}
        onDrop={drop}
        onDragOver={dragOver}
        className={props.className}>
            {props.children }
        </div>
    )
}


{/* <Board>Der text hier drinnen ist das Child</Board> */}