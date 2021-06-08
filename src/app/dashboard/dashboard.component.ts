import { Component } from '@angular/core';
import { IProcesarState } from '../models/procesar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { clean } from '../procesar/procesar.actions';
import { FeatureTogglesService } from '../services/feature-toggles.service';
import { DialogElementDetail } from './dialog-element-detail/dialog-element-detail.component';
import { CustomItemService } from '../services/custom-item.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  _procesar: IProcesarState = {
    items: [],
    idField: '',
    nameField: '',
    customFields: []
  };
  baseColumns: string[] = ['id', 'name'];
  displayedColumns: string[] = this.baseColumns;
  dataSource = new MatTableDataSource(this._procesar.items);
  procesar$: Observable<IProcesarState> | undefined;

  constructor(
    private router: Router,
    private store: Store<{ procesar: IProcesarState }>,
    private customItemService: CustomItemService,
    public featureService: FeatureTogglesService,
    public dialog: MatDialog
  ) {
    this.procesar$ = store.select('procesar');
    this.procesar$.subscribe(procesar => {
      console.log('Dashboard Procesar Subscribe - Items changed:', procesar);
      this._procesar = procesar;
      this.displayedColumns = this.baseColumns.concat(procesar.customFields.map(field => (field.key)));
      this.displayedColumns.push('action');
      this.dataSource = this.newDataSource(this._procesar.items);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getValue(element: any, key: string): string { return this.customItemService.baseGetValue(element, key); }

  newDataSource(origin: any[]): MatTableDataSource<any> {
    const localDataSource = new MatTableDataSource(origin);
    localDataSource.filterPredicate = (data: Element, filter: string) => {
      return this.getValue(data, this._procesar.idField).toLowerCase().includes(filter) || 
        this.getValue(data, this._procesar.nameField).toLowerCase().includes(filter) ||
        this._procesar.customFields.filter(field => this.getValue(data, field.key).toLowerCase().includes(filter)).length > 0;
    }
    return localDataSource;
  }

  openDetail(element: any) {
    this.dialog.open(DialogElementDetail, { width: '640px', data: { data: element, procesar: this._procesar }});
  }

  goToHome() {
    this.store.dispatch(clean());
    this.router.navigate([""]);
  }

  createOnlineSession() {

  }
}
