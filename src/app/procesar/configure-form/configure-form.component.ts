import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IOnlineSesion } from 'src/app/models/online-sesion';
import { ICustomField, IProgressField } from 'src/app/models/procesar';
import { FeatureTogglesService } from 'src/app/services/feature-toggles.service';
import { configure, setCustomFields, setEditionFields, setProgressField } from '../../stores/online-session.actions';

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
    editionFields: this.formBuilder.group({
      displayName: [''],
      key: ['']
    })
  });
  procesar$: Observable<IOnlineSesion> | undefined;
  items: any[] = [];
  customFields: ICustomField[] = [];
  editionFields: ICustomField[] = [];
  displayedColumns: string[] = ['displayName', 'key', 'action'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    public featureService: FeatureTogglesService,
    private store: Store<{ onlineSession: IOnlineSesion }>
  ) {
    this.procesar$ = store.select('onlineSession');
    this.procesar$.subscribe(onlineSession => {
      console.log('Online Session Subscribe - Items changed:', onlineSession);
      this.items = Object.assign([], onlineSession.procesar.items);
      this.customFields = Object.assign([], onlineSession.procesar.customFields);
      this.editionFields = Object.assign([], onlineSession.procesar.editionFields);
      if (!this.registrar) {
        this.processFormGroup.patchValue(onlineSession.procesar);
      }
    });
  }

  doProcess() {
    if (this.processFormGroup.valid) {
      if (this.processFormGroup.value.enabledProgressBar) {
        this.store.dispatch(setProgressField({
          progressField: <IProgressField>{
            field: this.processFormGroup.controls.progressField.value.field,
            firstState: this.processFormGroup.controls.progressField.value.firstState,
            secondState: this.processFormGroup.controls.progressField.value.secondState
          }
        }));
      }
      this.store.dispatch(configure({
        idField: this.processFormGroup.value.idField,
        nameField: this.processFormGroup.value.nameField
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

  addEditionField() {
    if (this.editionFields.length === 3) {
      alert('Cannot add more than 3 edition fields.')
      return;
    }
    if (this.editionFields.find(field => (field.key === this.processFormGroup.get('editionFields')?.value.key))) {
      alert('Key alredy registrered into other edition field.')
      return;
    }
    console.log('Add Edition Field - Edition Field:', this.processFormGroup.get('editionFields')?.value);
    const newEditionField = this.processFormGroup.get('editionFields')?.value as ICustomField;
    console.log('Add Edition Field - New Edition Field:', newEditionField);
    this.editionFields.push(newEditionField);
    this.store.dispatch(setEditionFields({ editionFields: this.editionFields }));
    this.processFormGroup.get('editionFields')?.reset();
  }

  deleteCustomField(customField: ICustomField) {
    this.customFields = this.customFields.filter(field => {
      return field.key != customField.key;
    });
    this.store.dispatch(setCustomFields({ customFields: this.customFields }));
  }

  deleteEditionField(editionField: ICustomField) {
    this.editionFields = this.editionFields.filter(field => {
      return field.key != editionField.key;
    });
    this.store.dispatch(setEditionFields({ editionFields: this.editionFields }));
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
