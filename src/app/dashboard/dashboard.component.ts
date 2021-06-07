import { Component, Inject } from '@angular/core';
import { IProcesarState } from '../models/procesar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodeModel } from '@ngstack/code-editor';
import * as YAML from 'yaml';
import { Router } from '@angular/router';
import { clean, updateItem } from '../procesar/procesar.actions';

const baseGetValue = (element: any, key: string): string => {
  const paths = key.split('.');
  let current = element
    , i;

  for (i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return '';
    } else {
      current = current[paths[i]];
    }
  }
  return current;
};

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

  getValue(element: any, key: string): string { return baseGetValue(element, key); }

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

@Component({
  selector: 'dialog-element-detail',
  templateUrl: './dialog-element-detail/dialog-element-detail.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DialogElementDetail {
  readOnly = true;
  options = {
    contextmenu: true,
    minimap: {
      enabled: true
    }
  };
  codeModel: CodeModel = {
    language: 'yaml',
    uri: 'element.json',
    value: '---',
  };

  constructor(
    private store: Store<{ procesar: IProcesarState }>,
    @Inject(MAT_DIALOG_DATA) public input: any
  ) {
    console.log('Dialog Detail - Element:', input);
    this.codeModel.value = YAML.stringify(input.data);
  }

  getValue(element: any, key: string): string { return baseGetValue(element, key); }

  save(value: any) {
    const updatedItem = YAML.parse(value);
    if (updatedItem) {
      this.store.dispatch(updateItem({ updatedItem: updatedItem }));
    }
  }
}
