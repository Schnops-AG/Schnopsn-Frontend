import { Player } from "./player";

export interface Game{
    gameID: string,
    gameType: string,
    players: Player[],
    inviteUrl: string,
    currentTrump: string,
    maxNumberOfPlayers: number,
    teams: any,
    currentHighestCall: any
}


//     private UUID gameid;
//     private GameType gameType;
//     private List<Player> players;
//     private URL inviteLink;
//     private Color currentTrump;
//     private int maxNumberOfPlayers;
//     private Team[] teams;
//     private Call currentHighestCall;