import { Action, createReducer, INIT, on } from '@ngrx/store';
import { IOnlineSesion } from '../models/online-sesion';
import { CustomItemService } from '../services/custom-item.service';
import { setItems, configure, setCustomFields, clean, setProgressField, updateItem, set, setProcesar, setId } from './online-session.actions';

const customItemService: CustomItemService = new CustomItemService();

export const initialState: IOnlineSesion = {
  id: 0,
  procesar: {
    items: [],
    idField: '',
    nameField: '',
    customFields: []
  }
};

const _onlineSessionReducer = createReducer(
  initialState,
  on(set, (state, { onlineSession }) => ({ ...onlineSession })),
  on(setId, (state, { id }) => ({ ...state, id: id })),
  on(setProcesar, (state, { procesar }) => ({ ...state, procesar: procesar })),
  on(setItems, (state, { items }) => ({ ...state, procesar: { ...state.procesar, items: items }})),
  on(configure, (state, { idField, nameField }) => ({ ...state, procesar: { ...state.procesar, idField: idField, nameField: nameField }})),
  on(setCustomFields, (state, { customFields }) => ({ ...state, procesar: { ...state.procesar, customFields: customFields }})),
  on(setProgressField, (state, { progressField }) => ({ ...state, procesar: { ...state.procesar, progressField: progressField }})),
  on(updateItem, (state, { updatedItem }) => ({ ...state, procesar: { ...state.procesar, items: state.procesar.items.map(item => {
    if (customItemService.baseGetValue(item, state.procesar.idField) === customItemService.baseGetValue(updatedItem, state.procesar.idField)) {
      console.log('Update Item - Item:', updatedItem);
      return updatedItem;
    } else {
      return item;
    }
  })}})),
  on(clean, () => (initialState))
);

export function onlineSessionReducer(state: any, action: Action) {
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
  const nextState = _onlineSessionReducer(state, action);
  localStorage.setItem("procesarState", JSON.stringify(nextState));
  return nextState;
}
