import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { ProcesarService } from 'src/app/services/procesar.service';
import { IProcesarState } from '../models/procesar';
import { Store } from '@ngrx/store';
import { configure, setItems } from './procesar.actions';

@Component({
  selector: 'app-procesar',
  templateUrl: './procesar.component.html',
  styleUrls: ['./procesar.component.scss']
})
export class ProcesarComponent implements OnInit {
  @ViewChild('stepper')
  stepper: MatStepper | undefined;

  registrar: boolean = false;
  registerFormGroup: FormGroup = this.formBuilder.group({});
  processFormGroup: FormGroup = this.formBuilder.group({});
  process: Subscription | undefined;

  procesar$: Observable<IProcesarState> | undefined;
  items: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private serviceProcesar: ProcesarService,
    private router: Router,
    private store: Store<{ procesar: IProcesarState }>
  ) {
    this.procesar$ = store.select('procesar');
    this.procesar$.subscribe(procesar => {
      console.log('Procesar Subscribe - Items changed:', procesar);
      this.items = procesar.items;
    });
  }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      url: ['assets/example.json', Validators.required],
      itemsField: ['items', Validators.required]
    });
    this.processFormGroup = this.formBuilder.group({
      idField: ['', Validators.required],
      nameField: ['', Validators.required]
    });
  }

  register() {
    if (this.registerFormGroup.valid) {
      console.log('Do Load - URL:', this.registerFormGroup?.value.url);
      this.stepper?.next();
      this.process = this.serviceProcesar.getYamls(
        this.registerFormGroup?.value.url,
        this.registerFormGroup?.value.itemsField
      ).subscribe((result) => {
        console.log('Do Load - Result:', result);
        this.store.dispatch(setItems({ items: <any[]> result }));
        this.registrar = true;
      });
    }
  }

  cancelLoading() {
    console.log('Cancel Loading - Stepper.');
    this.process?.unsubscribe();
    this.stepper?.reset();
  }

  doProcess() {
    if (this.processFormGroup.valid) {
      this.store.dispatch(configure({
        idField: this.processFormGroup.value.idField,
        nameField: this.processFormGroup.value.nameField
      }));
      this.router.navigate(['/dashboard']);
    }
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
