import { Action, createReducer, INIT, on } from '@ngrx/store';
import { setItems, configure, setCustomFields, clean, setProgressField, updateItem } from './procesar.actions';
import { IProcesarState } from 'src/app/models/procesar';

export const initialState: IProcesarState = {
  items: [],
  idField: '',
  nameField: '',
  customFields: []
};

const _procesarReducer = createReducer(
  initialState,
  on(setItems, (state, { items }) => ({ ...state, items: items })),
  on(configure, (state, { idField, nameField }) => ({ ...state, idField: idField, nameField: nameField })),
  on(setCustomFields, (state, { customFields }) => ({ ...state, customFields: customFields })),
  on(setProgressField, (state, { progressField }) => ({ ...state, progressField: progressField })),
  on(updateItem, (state, { updatedItem }) => ({ ...state, items: state.items.map(item => {
    if (item[state.idField] === updatedItem[state.idField]) {
      console.log('Update Item - Item:', updatedItem);
      return updatedItem;
    } else {
      return item;
    }
  }) })),
  on(clean, () => (initialState))
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
