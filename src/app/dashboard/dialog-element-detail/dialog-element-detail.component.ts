import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { CodeModel } from "@ngstack/code-editor";
import { IProcesarState } from "src/app/models/procesar";
import { updateItem } from "src/app/procesar/procesar.actions";
import { CustomItemService } from "src/app/services/custom-item.service";
import * as YAML from 'yaml';

@Component({
  selector: 'dialog-element-detail',
  templateUrl: './dialog-element-detail.component.html',
  styleUrls: ['./dialog-element-detail.component.scss']
})
export class DialogElementDetail {
  readOnly = true;
  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };
  codeModel: CodeModel = {
    language: 'yaml',
    uri: 'element.json',
    value: '---',
  };

  constructor(
    private store: Store<{ procesar: IProcesarState }>,
    private customItemService: CustomItemService,
    @Inject(MAT_DIALOG_DATA) public input: any
  ) {
    console.log('Dialog Detail - Element:', input);
    this.codeModel.value = YAML.stringify(input.data);
  }

  getValue(element: any, key: string): string { return this.customItemService.baseGetValue(element, key); }

  save(value: any) {
    const updatedItem = YAML.parse(value);
    if (updatedItem) {
      this.store.dispatch(updateItem({ updatedItem: updatedItem }));
    }
  }
}
