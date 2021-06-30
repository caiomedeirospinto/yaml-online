import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IOnlineSesion } from 'src/app/models/online-sesion';
import { CustomItemService } from 'src/app/services/custom-item.service';
import { updateItem } from 'src/app/stores/online-session.actions';

@Component({
  selector: 'app-dialog-element-local-edition',
  templateUrl: './dialog-element-local-edition.component.html',
  styleUrls: ['./dialog-element-local-edition.component.scss']
})
export class DialogElementLocalEditionComponent {

  _onlineSession: IOnlineSesion = {
    id: 0,
    procesar: {
      customFields: [],
      idField: '',
      nameField: '',
      items: [],
      editionFields: []
    }
  };
  procesar$: Observable<IOnlineSesion> | undefined;
  localEditionFormGroup: FormGroup;

  constructor(
    private store: Store<{ onlineSession: IOnlineSesion }>,
    private customItemService: CustomItemService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public input: any
  ) {
    this.localEditionFormGroup = this.formBuilder.group({});
    console.log('Dialog Local Edition - Element:', input);
    this.procesar$ = store.select('onlineSession');
    this.procesar$.subscribe(onlineSession => {
      this._onlineSession = onlineSession;
      this.createForm();
    });
  }

  createForm() {
    console.log('Dialog Local Edition - Create form');
    this._onlineSession.procesar.editionFields.forEach(field => {
      const formField = this.localEditionFormGroup.get(field.key.split('.').reverse()[0]);
      console.log('Dialog Local Edition - Form field:', formField);
      if (formField) {
        // formField.setValue(this.getValue(this.input.data, field.key));
      } else {
        this.localEditionFormGroup.addControl(field.key.split('.').reverse()[0], new FormControl(this.getValue(this.input.data, field.key)));
      }
    })
  }

  getValue(element: any, key: string): string { return this.customItemService.baseGetValue(element, key); }

  save() {
    console.log('Dialog Local Edition dispatched');
    let newValue = {};
    this._onlineSession.procesar.editionFields.forEach((field, index) => {
      const formField = this.localEditionFormGroup.get(field.key.split('.').reverse()[0]);
      console.log('Dialog Local Edition - Form field:', index, formField);
      if (formField) {
        newValue = this.customItemService.baseSetValue(this.input.data, field.key, formField?.value);
        console.log('Dialog Local Edition - new value:', newValue);
      }
      if (index === this._onlineSession.procesar.editionFields.length - 1) {
        this.store.dispatch(updateItem({ updatedItem: newValue }));
        this.snackBar.open('All changes saved', 'x', { duration: 1500, horizontalPosition: 'right' });
      }
    });
  }
}
