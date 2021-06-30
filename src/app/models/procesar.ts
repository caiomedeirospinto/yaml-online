export interface ICustomField {
  displayName: string;
  key: string;
}

export interface IProgressField {
  field: string;
  firstState: string;
  secondState: string;
}

export interface IProcesarState {
  items: any[];
  idField: string;
  nameField: string;
  customFields: ICustomField[];
  progressField?: IProgressField;
  editionFields: ICustomField[];
}
