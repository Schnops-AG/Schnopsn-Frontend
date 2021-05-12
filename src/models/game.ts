import { Player } from "./player";

export interface Game{
    gameID: string,
    gameType: string,
    players: Player[],
    inviteLink: string,
    currentTrump: string,
    maxNumberOfPlayers: number,
    teams: any, // TODO
    currentHighestCall: any
}

export class Game implements Game{
    
}


//     private UUID gameid;
//     private GameType gameType;
//     private List<Player> players;
//     private URL inviteLink;
//     private Color currentTrump;
//     private int maxNumberOfPlayers;
//     private Team[] teams;
//     private Call currentHighestCall;