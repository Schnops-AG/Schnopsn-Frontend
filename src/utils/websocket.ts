
const DEFAULT_URL = 'ws://localhost:8080/schnopsn'

export class CustomWebSocket{
    socketUrl = DEFAULT_URL; // ws ... insecure, wss ... secure
    webSocket: WebSocket;

    playerID: string;


    constructor(playerID: string, url: string = DEFAULT_URL){
        this.playerID = playerID;
        this.socketUrl = url;
        this.webSocket = new WebSocket(this.socketUrl);
        this.connect();
    }

    getReadyState = (): number =>{
        return this.webSocket.readyState;
    }


    onReceiveMessage = (event: MessageEvent): void =>{
        console.log('receiving a message: ');
        console.log(event.data);
    }

    onOpen = (event: Event): void => {
        console.log('opening..');
        this.webSocket.send(this.playerID);
    }



    onClose = (event: Event): void =>{
        console.log('closing..');
        console.log(event)
    }

    onError = (event: Event): void =>{
        console.log('error:');
        console.log(event);
    }

    connect = () =>{

        console.log('state: ' +  this.webSocket.readyState);


        if(this.webSocket.readyState === this.webSocket.CLOSED){
            console.log('here??');
            this.webSocket = new WebSocket(this.socketUrl)
        }

        this.webSocket.onopen = this.onOpen;
        this.webSocket.onclose = this.onClose;
        this.webSocket.onerror = this.onError;
        this.webSocket.addEventListener('message', this.onReceiveMessage);
    }
    

    async sendMessage (msg: string){
        if(this.webSocket.readyState === this.webSocket.OPEN){
            console.log('sending: ' + msg);
            this.webSocket.send(msg);
        }
    }


    disconnect = () =>{
        this.webSocket.close();
    }

}