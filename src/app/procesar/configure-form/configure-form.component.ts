import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ICustomField, IProcesarState, IProgressField } from 'src/app/models/procesar';
import { configure, setCustomFields, setProgressField } from '../procesar.actions';

@Component({
  selector: 'app-configure-form',
  templateUrl: './configure-form.component.html',
  styleUrls: ['./configure-form.component.scss']
})
export class ConfigureFormComponent {

  @Input()
  registrar = false;
  @Input()
  readOnly = false;
  @Input()
  cancelLoading: () => void = () => {};

  processFormGroup: FormGroup = this.formBuilder.group({
    idField: [''],
    nameField: [''],
    customFields: this.formBuilder.group({
      displayName: [''],
      key: ['']
    }),
    enabledProgressBar: [false],
    progressField: this.formBuilder.group({
      field: [''],
      firstState: [''],
      secondState: ['']
    }),
  });
  procesar$: Observable<IProcesarState> | undefined;
  items: any[] = [];
  customFields: ICustomField[] = [];
  displayedColumns: string[] = ['displayName', 'key', 'action'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private store: Store<{ procesar: IProcesarState }>
  ) {
    this.procesar$ = store.select('procesar');
    this.procesar$.subscribe(procesar => {
      console.log('Procesar Subscribe - Items changed:', procesar);
      this.items = Object.assign([], procesar.items);
      this.customFields = Object.assign([], procesar.customFields);
      this.processFormGroup.patchValue(procesar);
    });
  }

  doProcess() {
    if (this.processFormGroup.valid) {
      this.store.dispatch(configure({
        idField: this.processFormGroup.value.idField,
        nameField: this.processFormGroup.value.nameField
      }));
      this.store.dispatch(setProgressField({
        progressField: <IProgressField>{
          field: this.processFormGroup.controls.progressField.value.field,
          firstState: this.processFormGroup.controls.progressField.value.firstState,
          secondState: this.processFormGroup.controls.progressField.value.secondState
        }
      }));
      this.router.navigate(['/dashboard']);
    }
  }

  addCustomField() {
    if (this.customFields.length === 3) {
      alert('Cannot add more than 3 custom fields.')
      return;
    }
    if (this.customFields.find(field => (field.key === this.processFormGroup.get('customFields')?.value.key))) {
      alert('Key alredy registrered into other custom field.')
      return;
    }
    console.log('Add Custom Field - Custom Field:', this.processFormGroup.get('customFields')?.value);
    const newCustomField = this.processFormGroup.get('customFields')?.value as ICustomField;
    console.log('Add Custom Field - New Custom Field:', newCustomField);
    this.customFields.push(newCustomField);
    this.store.dispatch(setCustomFields({ customFields: this.customFields }));
    this.processFormGroup.get('customFields')?.reset();
  }

  deleteCustomField(customField: ICustomField) {
    this.customFields = this.customFields.filter(field => {
      return field.key != customField.key;
    });
    this.store.dispatch(setCustomFields({ customFields: this.customFields }));
  }

  getValue(key: string): string {
    if (this.items.length === 0) {
      return '';
    }
    if (this.items.length !== 0) {
      const paths = key.split('.');
      let current = this.items[0]
        , i;

      for (i = 0; i < paths.length; ++i) {
        if (current[paths[i]] == undefined) {
          return '';
        } else {
          current = current[paths[i]];
        }
      }
      return current;
    }
    return '';
  }
}
