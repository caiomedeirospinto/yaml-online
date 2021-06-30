import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IOnlineSesion } from 'src/app/models/online-sesion';
import { WsConnectionState } from 'src/app/models/ws-connection-state';
import { FeatureTogglesService } from 'src/app/services/feature-toggles.service';
import { OnlineSessionService } from 'src/app/services/online-session.service';
import { clean, set } from 'src/app/stores/online-session.actions';
import { DialogCreateOnlineSession } from '../dialog-create-online-session/dialog-create-online-session.component';

@Component({
  selector: 'app-online-session',
  templateUrl: './online-session.component.html',
  styleUrls: ['./online-session.component.scss']
})
export class OnlineSessionComponent implements OnInit {

  state: WsConnectionState = WsConnectionState.INIT;
  creating = false;
  _onlineSession: IOnlineSesion = {
    id: 0,
    procesar: {
      items: [],
      idField: '',
      nameField: '',
      customFields: [],
      editionFields: []
    }
  };
  procesar$: Observable<IOnlineSesion> | undefined;

  constructor(
    private router: Router,
    private onlineSessionService: OnlineSessionService,
    public featureService: FeatureTogglesService,
    private snackBar: MatSnackBar,
    public dialog: MatDialog,
    private store: Store<{ onlineSession: IOnlineSesion }>
  ) {
    this.procesar$ = store.select('onlineSession');
    this.procesar$.subscribe(onlineSession => {
      console.log('Online Session Subscribe - Items changed:', onlineSession);
      this._onlineSession = onlineSession;
      if (onlineSession.id !== 0 && this.state === WsConnectionState.INIT) {
        this.subscribeConnection();
      }
    });
  }

  ngOnInit(): void {
    // this.subscribeConnection();
  }

  private subscribeConnection() {
    this.onlineSessionService.state$.subscribe(state => {
      console.log('Online Session State:', state);
      if (state === -1) {
        this.snackBar.open(
          'You are Disconnected!, so you cannot receive and make changes.',
          'Reconnect',
          {
            duration: 0,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          }
        ).onAction().subscribe(() => {
          this.onlineSessionService.connect(this._onlineSession.id.toString(), { reconnect: false });
        });
      } else {
        this.snackBar.dismiss();
      }
      this.state = state;
    });
    this.onlineSessionService.connect(this._onlineSession.id.toString(), { reconnect: false });
  }

  openCreateOnlineSessionDialog() {
    this.dialog.open(DialogCreateOnlineSession, { width: '400px' }).afterClosed().subscribe(() => {
      console.log('Close Dialog Create Online Session:', localStorage.getItem('username'));
      if (localStorage.getItem('username')) {
        this.createOnlineSession();
      }
    });
  }

  createOnlineSession() {
    this.creating = true;
    this.onlineSessionService.new(this._onlineSession)
      .subscribe(onlineSession => {
        this.store.dispatch(set({ onlineSession }));
        this.subscribeConnection();
        this.creating = false;
      });
  }

  closeConnection() {
    this.snackBar.dismiss();
    this.store.dispatch(clean());
    this.onlineSessionService.close();
    this.router.navigate(["/"])
  }

  get stateName(): string {
    switch(this.state) {
      case WsConnectionState.CONNECTING:
        return "Connecting";
      case WsConnectionState.CONNECTED:
        return "Connected";
      case WsConnectionState.DISCONNECTED:
        return "Disconnected";
      case WsConnectionState.ERROR:
        return "Error";
      case WsConnectionState.RECONNECTING:
        return "Reconnecting";
      case WsConnectionState.CLOSED:
        return "Closed";
      case WsConnectionState.NOTFOUND:
        return "Not found";
      default:
        return "--"
    }
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }
}
