export interface Player{
    playerID: string,
    playerName: string,
    caller: boolean,
    
    playsCall?: boolean,
    playerNumber?: number,

    active: boolean,
    admin: boolean
}