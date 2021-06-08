import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { CodeModel } from "@ngstack/code-editor";
import { updateItem } from "src/app/stores/online-session.actions";
import { CustomItemService } from "src/app/services/custom-item.service";
import * as YAML from 'yaml';
import { IOnlineSesion } from "src/app/models/online-sesion";
import { OnlineSessionService } from "src/app/services/online-session.service";
import { WsConnectionState } from "src/app/models/ws-connection-state";
import { Observable, Subscription } from "rxjs";
import { skip } from "rxjs/internal/operators";
import { ofType, Actions } from '@ngrx/effects';

@Component({
  selector: 'dialog-element-detail',
  templateUrl: './dialog-element-detail.component.html',
  styleUrls: ['./dialog-element-detail.component.scss']
})
export class DialogElementDetail implements OnInit, OnDestroy {

  _onlineSession: IOnlineSesion | undefined;
  updateSubscription = new Subscription();
  procesar$: Observable<IOnlineSesion> | undefined;
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
    private store: Store<{ onlineSession: IOnlineSesion }>,
    private customItemService: CustomItemService,
    private onlineSessionService: OnlineSessionService,
    private actions: Actions,
    @Inject(MAT_DIALOG_DATA) public input: any
  ) {
    console.log('Dialog Detail - Element:', input);
    this.codeModel.value = YAML.stringify(input.data);
    this.procesar$ = store.select('onlineSession');
    this.procesar$.subscribe(onlineSession => {
      this._onlineSession = onlineSession;
    });
  }

  ngOnInit(): void {
    this.updateSubscription = this.actions.pipe(ofType('[Procesar Component] Update Item'))
      .subscribe((data: any) => {
        console.log('Update Item Action subscribe:', data);
        this.onlineSessionService.sendMessage({
          key: 'changed',
          value: JSON.stringify(this._onlineSession?.procesar.items)
        });
      });
  }

  ngOnDestroy(): void {
    this.updateSubscription.unsubscribe();
  }

  getValue(element: any, key: string): string { return this.customItemService.baseGetValue(element, key); }

  save(value: any) {
    const updatedItem = YAML.parse(value);
    if (updatedItem) {
      this.store.dispatch(updateItem({ updatedItem: updatedItem }));
    }
  }

  get readOnly() {
    return ![WsConnectionState.CONNECTED].includes(this.onlineSessionService.state);
  }
}
