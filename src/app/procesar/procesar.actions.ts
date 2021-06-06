import { createAction, props } from '@ngrx/store';

export const setItems = createAction('[Procesar Component] Set Items', props<{items: any[]}>());
export const configure = createAction('[Procesar Component] Configure', props<{idField: string, nameField: string}>());
