import { Component, Inject } from '@angular/core';
import { IProcesarState } from '../models/procesar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CodeModel } from '@ngstack/code-editor';
import * as YAML from 'yaml';
import { Router } from '@angular/router';

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
    nameField: ''
  };
  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource(this._procesar.items);
  procesar$: Observable<IProcesarState> | undefined;

  constructor(
    private router: Router,
    private store: Store<{ procesar: IProcesarState }>,
    public dialog: MatDialog
  ) {
    this.procesar$ = store.select('procesar');
    this.procesar$.subscribe(procesar => {
      console.log('Procesar Subscribe - Items changed:', procesar);
      this._procesar = procesar;
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
        this.getValue(data, this._procesar.nameField).toLowerCase().includes(filter);
    }
    return localDataSource;
  }

  openDetail(element: any) {
    this.dialog.open(DialogElementDetail, { width: '640px', data: { data: element, procesar: this._procesar }});
  }

  goToHome() {
    localStorage.clear();
    this.router.navigate([""]);
  }
}

@Component({
  selector: 'dialog-element-detail',
  templateUrl: './dialog-element-detail.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DialogElementDetail {
  public options = {
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
    @Inject(MAT_DIALOG_DATA) public input: any
  ) {
    console.log('Dialog Detail - Element:', input);
    this.codeModel.value = YAML.stringify(input.data);
  }

  getValue(element: any, key: string): string { return baseGetValue(element, key); }
}
