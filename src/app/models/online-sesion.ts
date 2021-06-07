import { IProcesarState } from "./procesar";

export interface IOnlineSesion {
  id: string;
  usersConnected: string[];
  procesar: IProcesarState;
}
