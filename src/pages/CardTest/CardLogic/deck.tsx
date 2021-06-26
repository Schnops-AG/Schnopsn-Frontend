

const SUITS = ["♠", "♣", "♥", "♦"];

const VALUES = [
    "A",
    // "2",
    // "3",
    // "4",
    // "5",
    // "6",
    // "7",
    // "8",
    // "9", 
    "10",
    "J",
    "Q",
    "K"
]

export default class Deck{
    cards : Card[];

    constructor(){
        this.cards = createDeck();
    }

    get numberOfCards(){
        return this.cards.length;
    }

    shuffle(){
        for(let i = this.numberOfCards - 1; i > 0; i--){
            const newIndex = Math.floor(Math.random() * (i + 1));
            const oldValue = this.cards[newIndex];
            this.cards[newIndex] = this.cards[i];
            this.cards[i] = oldValue;
        }
    }
}

class Card{
    suit : string;
    value : string;

    constructor(suit : string, value : string){
        this.suit = suit;
        this.value = value;
    }

    get color(){
        return this.suit === "♣" || this.suit === "♠" ? 'black' : 'red';
    }
}

function createDeck() : Card[]{
    return SUITS.flatMap(suit =>{
        // ["♠", "♣", "♥", "♦"]; -> Array[4]
        return VALUES.map(value =>{
            // Array[13]
            return new Card(suit, value);
        })
    })
}
