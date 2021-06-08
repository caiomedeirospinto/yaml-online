export enum WsConnectionState {
  INIT = -2,
  CONNECTING = 0,
  CONNECTED = 1,
  DISCONNECTED = -1,
  ERROR = 2,
  RECONNECTING = 3,
  CLOSED = 4,
  NOTFOUND = 6
}
