import { IProcesarState } from "./procesar";

export interface IOnlineSesion {
  id: number;
  procesar: IProcesarState;
}
