import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { ProcesarService } from 'src/app/services/procesar.service';
import { IProcesarState } from '../models/procesar';
import { Store } from '@ngrx/store';
import { setItems } from './procesar.actions';

@Component({
  selector: 'app-procesar',
  templateUrl: './procesar.component.html',
  styleUrls: ['./procesar.component.scss']
})
export class ProcesarComponent implements OnInit {
  @ViewChild('stepper')
  stepper: MatStepper | undefined;

  loaded = false;
  registrar = false;
  registerFormGroup: FormGroup = this.formBuilder.group({});
  onlineSessionFormGroup: FormGroup = this.formBuilder.group({});
  process: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private serviceProcesar: ProcesarService,
    private store: Store<{ procesar: IProcesarState }>
  ) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      url: ['assets/example.json', Validators.required],
      itemsField: ['items', Validators.required]
    });
    this.onlineSessionFormGroup = this.formBuilder.group({
      id: ['', Validators.required]
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
    this.reset();
  }

  reset() {
    this.registrar = false;
    this.stepper?.previous();
  }

  loadOnlineSession() { }
}
