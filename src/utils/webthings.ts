/**
 * This file acts as a simple config file.
 * (for both endpoints and websocket)
 */

const port :number = 8080; 
const ip :string = "localhost";

// for api requests
export const BASE_URL: string = `http://${ip}:${port}/api/v1`;

// for the websocket
export const WEBSOCKET_URL: string = `ws://${ip}:${port}/schnopsn`;

