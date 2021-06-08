import { createAction, props } from '@ngrx/store';
import { ICustomField, IProcesarState, IProgressField } from '../models/procesar';

export const set = createAction('[Procesar Component] Set', props<{procesar: IProcesarState}>());
export const setItems = createAction('[Procesar Component] Set Items', props<{items: any[]}>());
export const configure = createAction('[Procesar Component] Configure', props<{idField: string, nameField: string}>());
export const setCustomFields = createAction('[Procesar Component] Set Custom Fields', props<{customFields: ICustomField[]}>());
export const setProgressField = createAction('[Procesar Component] Set Progress Field', props<{progressField: IProgressField}>());
export const updateItem = createAction('[Procesar Component] Update Item', props<{updatedItem: any}>());
export const clean = createAction('[Procesar Component] Clean');
