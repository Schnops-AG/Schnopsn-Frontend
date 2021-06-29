import { Player } from "./player";
import { Team } from "./team";

export interface Game{
    gameID: string,
    gameType: string,
    inviteLink: string,
    
    // players: Player[],

    currentTrump: string,
    maxNumberOfPlayers: number,
    
    teams: Team[],
    currentHighestCall: any // TODO
    
}

export class Game implements Game{
    
}

// private UUID gameID;
// private GameType gameType;
// private URL inviteLink;
// private Color currentTrump;
// private int maxNumberOfPlayers;
// private List<Team> teams;
// private Call currentHighestCall;
// private Map<Player,Card> playedCards;