
const DEFAULT_URL = 'ws://localhost:8080/schnopsn'

export class CustomWebSocket{
    socketUrl = DEFAULT_URL; // ws ... insecure, wss ... secure
    webSocket: WebSocket;


    constructor(url: string = DEFAULT_URL){
        this.socketUrl = url;
        this.webSocket = new WebSocket(this.socketUrl);
        this.connect();
    }


    onReceiveMessage = (event: MessageEvent): void =>{
        console.log('receiving a message: ');
        console.log(event.data);
    }

    onOpen = (event: Event): void => {
        console.log('opening..');
        // this.webSocket.send('hello from client');
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
    




    sendMessage = (msg: string) =>{
        console.log('sending: ' + msg);
        this.webSocket.send(msg);
    }


    disconnect = () =>{
        this.webSocket.close();
    }

}