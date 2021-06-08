import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { clean } from '../stores/online-session.actions';
import { DialogElementDetail } from './dialog-element-detail/dialog-element-detail.component';
import { CustomItemService } from '../services/custom-item.service';
import { IOnlineSesion } from '../models/online-sesion';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  creating = false;
  _onlineSession: IOnlineSesion = {
    id: 0,
    procesar: {
      items: [],
      idField: '',
      nameField: '',
      customFields: []
    }
  };
  baseColumns: string[] = ['id', 'name'];
  displayedColumns: string[] = this.baseColumns;
  dataSource = new MatTableDataSource(this._onlineSession.procesar.items);
  procesar$: Observable<IOnlineSesion> | undefined;

  constructor(
    private router: Router,
    private store: Store<{ onlineSession: IOnlineSesion }>,
    private customItemService: CustomItemService,
    public dialog: MatDialog
  ) {
    this.procesar$ = store.select('onlineSession');
    this.procesar$.subscribe(onlineSession => {
      console.log('Dashboard Online Session Subscribe - Items changed:', onlineSession);
      this._onlineSession = onlineSession;
      this.displayedColumns = this.baseColumns.concat(onlineSession.procesar.customFields.map(field => (field.key)));
      this.displayedColumns.push('action');
      this.dataSource = this.newDataSource(this._onlineSession.procesar.items);
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
      return this.getValue(data, this._onlineSession.procesar.idField).toLowerCase().includes(filter) ||
        this.getValue(data, this._onlineSession.procesar.nameField).toLowerCase().includes(filter) ||
        this._onlineSession.procesar.customFields.filter(field => this.getValue(data, field.key).toLowerCase().includes(filter)).length > 0;
    }
    return localDataSource;
  }

  openDetail(element: any) {
    this.dialog.open(DialogElementDetail, { width: '640px', data: { data: element, procesar: this._onlineSession.procesar }});
  }

  goToHome() {
    this.store.dispatch(clean());
    this.router.navigate([""]);
  }
}
