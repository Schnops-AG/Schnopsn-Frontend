
const DEFAULT_URL = 'ws://localhost:8000'

export class CustomWebSocket{
    socketUrl = DEFAULT_URL; // ws ... insecure, wss ... secure
    webSocket: WebSocket;

    constructor(url: string = DEFAULT_URL){
        this.socketUrl = url;
        this.webSocket = new WebSocket(this.socketUrl);
        this.connect();
    }

    connect = () =>{
        if(this.webSocket.CLOSED){
            this.webSocket = new WebSocket(this.socketUrl)
        }


        const onOpen = (event: Event): void => {
            console.log('opening..');
            // this.webSocket.send('hello from client');
        }

        const onClose = (event: Event): void =>{
            console.log('closing..');
            console.log(event)
        }

        const onError = (event: Event): void =>{
            console.log('error:');
            console.log(event);
        }

        const onReceiveMessage = (event: MessageEvent): void =>{
            console.log('receiving a message: ');
            console.log(event.data);
        }

        this.webSocket.onopen = onOpen;
        this.webSocket.onclose = onClose;
        this.webSocket.onerror = onError;
        this.webSocket.onmessage = onReceiveMessage;

    }
    
    sendMessage = (msg: string) =>{
        this.webSocket.send(msg);
    }


    disconnect = () =>{
        this.webSocket.close();
    }

}