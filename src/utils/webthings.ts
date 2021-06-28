const port :number = 8080; // for both endpoints and websocket
const ip :string = "localhost"; // for both endpoints and websocket

export const BASE_URL: string = `http://${ip}:${port}/api/v1`;
export const WEBSOCKET_URL: string = `ws://${ip}:${port}/schnopsn`;

