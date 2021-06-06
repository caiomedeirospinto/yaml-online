import { Action, createReducer, INIT, on } from '@ngrx/store';
import { setItems, configure } from './procesar.actions';
import { IProcesarState } from 'src/app/models/procesar';

export const initialState: IProcesarState = {
  items: [],
  idField: '',
  nameField: ''
};

const _procesarReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => ({ ...state, items: items })),
  on(configure, (state, { idField, nameField }) => ({ ...state, idField: idField, nameField: nameField}))
);

export function procesarReducer(state: any, action: Action) {
  if (action.type === INIT) {
    const storageValue = localStorage.getItem("procesarState");
    if (storageValue) {
      try {
        return JSON.parse(storageValue);
      } catch {
        localStorage.removeItem("procesarState");
      }
    }
  }
  const nextState = _procesarReducer(state, action);
  localStorage.setItem("procesarState", JSON.stringify(nextState));
  return nextState;
}
