import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { ProcesarService } from 'src/app/services/procesar.service';
import { IProcesarState } from '../models/procesar';
import { Store } from '@ngrx/store';
import { clean, set, setItems } from '../stores/online-session.actions';
import { FeatureTogglesService } from '../services/feature-toggles.service';
import { OnlineSessionService } from '../services/online-session.service';
import { IOnlineSesion } from '../models/online-sesion';

@Component({
  selector: 'app-procesar',
  templateUrl: './procesar.component.html',
  styleUrls: ['./procesar.component.scss']
})
export class ProcesarComponent implements OnInit {
  @ViewChild('stepper')
  stepper: MatStepper | undefined;

  loadingSession = false;
  loaded = false;
  registrar = false;
  registerFormGroup: FormGroup = this.formBuilder.group({});
  onlineSessionFormGroup: FormGroup = this.formBuilder.group({});
  process: Subscription | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private serviceProcesar: ProcesarService,
    private onlineSessionService: OnlineSessionService,
    public featureService: FeatureTogglesService,
    private store: Store<{ onlineSession: IOnlineSesion }>
  ) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      url: ['assets/ocp-items.json', Validators.required],
      itemsField: ['items', Validators.required]
    });
    this.onlineSessionFormGroup = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern("[a-z0-9]*")]],
      id: ['', [Validators.required, Validators.pattern("[0-9]*")]]
    });
  }

  register() {
    if (this.registerFormGroup.valid) {
      console.log('Do Load - URL:', this.registerFormGroup?.value.url);
      this.store.dispatch(clean());
      this.stepper?.next();
      this.process = this.serviceProcesar.getYamls(
        this.registerFormGroup?.value.url,
        this.registerFormGroup?.value.itemsField
      ).subscribe((result) => {
        console.log('Do Load - Result:', result);
        this.store.dispatch(setItems({ items: <any[]> result }));
        this.registrar = true;
        this.loaded = false;
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
    this.stepper?.reset();
  }

  loadOnlineSession() {
    if (this.onlineSessionFormGroup.valid) {
      this.reset();
      this.loadingSession = true;
      this.onlineSessionService.findById(this.onlineSessionFormGroup.value.id)
        .subscribe((onlineSession) => {
          console.log('Load Online Session - Online Session: ', onlineSession);
          localStorage.setItem('username', this.onlineSessionFormGroup.value.username);
          if (onlineSession.id) {
            this.store.dispatch(set({ onlineSession }));
            this.loaded = true;
          } else {
            this.store.dispatch(clean());
          }
          this.loadingSession = false;
        }, (error) => {
          console.error(error);
          this.loadingSession = false;
        });
    }
  }
}
