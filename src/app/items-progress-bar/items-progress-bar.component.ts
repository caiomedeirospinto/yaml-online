import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IOnlineSesion } from '../models/online-sesion';
import { IProgressField } from '../models/procesar';
import { CustomItemService } from '../services/custom-item.service';

@Component({
  selector: 'app-items-progress-bar',
  templateUrl: './items-progress-bar.component.html',
  styleUrls: ['./items-progress-bar.component.scss']
})
export class ItemsProgressBarComponent {

  items: any[] = [];
  progressField: IProgressField | undefined = {
    field: '',
    firstState: '',
    secondState: ''
  };
  procesar$: Observable<IOnlineSesion> | undefined;

  constructor(
    private store: Store<{ onlineSession: IOnlineSesion }>,
    private customItemService: CustomItemService
  ) {
    this.procesar$ = store.select('onlineSession');
    this.procesar$.subscribe(onlineSession => {
      console.log('Item Detail Online Session Subscribe - Items changed:', onlineSession);
      this.progressField = onlineSession.procesar.progressField;
      this.items = onlineSession.procesar.items;
    });
  }

  firstState(): number {
    if (!this.progressField) {
      return 0;
    }
    const field = this.progressField?.field;
    return (this.items.filter(element => (this.customItemService.baseGetValue(element, field) === this.progressField?.firstState)).length * 100) / this.items.length;
  }

  secondState(): number {
    if (!this.progressField) {
      return 0;
    }
    const field = this.progressField?.field;
    return (this.items.filter(element => ([this.progressField?.firstState, this.progressField?.secondState].includes(this.customItemService.baseGetValue(element, field)))).length * 100) / this.items.length;
  }

  others(): number {
    if (!this.progressField) {
      return 0;
    }
    const field = this.progressField?.field;
    return (this.items.filter(element => (![this.progressField?.firstState, this.progressField?.secondState].includes(this.customItemService.baseGetValue(element, field)))).length * 100) / this.items.length;
  }
}
