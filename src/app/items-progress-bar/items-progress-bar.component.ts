import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IProcesarState, IProgressField } from '../models/procesar';

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
  procesar$: Observable<IProcesarState> | undefined;

  constructor(private store: Store<{ procesar: IProcesarState }>) {
    this.procesar$ = store.select('procesar');
    this.procesar$.subscribe(procesar => {
      console.log('Item Detail Procesar Subscribe - Items changed:', procesar);
      this.progressField = procesar.progressField;
      this.items = procesar.items;
    });
  }

  firstState(): number {
    if (!this.progressField) {
      return 0;
    }
    const field = this.progressField?.field;
    return (this.items.filter(element => (element[field] === this.progressField?.firstState)).length * 100) / this.items.length;
  }

  secondState(): number {
    if (!this.progressField) {
      return 0;
    }
    const field = this.progressField?.field;
    return (this.items.filter(element => ([this.progressField?.firstState, this.progressField?.secondState].includes(element[field]))).length * 100) / this.items.length;
  }

  others(): number {
    if (!this.progressField) {
      return 0;
    }
    const field = this.progressField?.field;
    return (this.items.filter(element => (![this.progressField?.firstState, this.progressField?.secondState].includes(element[field]))).length * 100) / this.items.length;
  }
}
