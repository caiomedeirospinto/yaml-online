import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, EMPTY, Observable, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, scan, take, tap } from 'rxjs/internal/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IOnlineSesion } from '../models/online-sesion';
import { WsConnectionState } from '../models/ws-connection-state';
import { set, setItems } from '../stores/online-session.actions';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineSessionService implements OnDestroy {

  private readonly subjectState = new BehaviorSubject<WsConnectionState>(WsConnectionState.INIT);
  public readonly state$ = this.subjectState.asObservable();

  private socket$: WebSocketSubject<any> | undefined;

  public doReconnect = false;

  constructor(
    private configService: ConfigService,
    private http: HttpClient,
    private store: Store<{ onlineSession: IOnlineSesion }>
  ) { }

  public connect(sessionId: string, cfg: { reconnect: boolean } = { reconnect: false }): void {
    console.log('Online Session Connecting:', sessionId);
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket(sessionId);
      this.socket$.pipe(cfg.reconnect && this.doReconnect ? this.reconnect : o => o,
        tap({
          next: (message: any) => {
            console.log('[DEBUG] Mensaje recibido: ', message);
            if (message.value === '404') {
              this.close(WsConnectionState.NOTFOUND);
            }

            if (message.key === 'init') {
              this.state = WsConnectionState.CONNECTED;
              const currentOnlineSession = JSON.parse(message.value);
              console.log('Online Session initialized:', currentOnlineSession);
              this.store.dispatch(set({
                onlineSession: {
                  ...currentOnlineSession,
                  procesar: {
                    ...currentOnlineSession.procesar,
                    items: JSON.parse(currentOnlineSession.procesar.items)
                  }
                }
              }));
              this.doReconnect = true;
            }

            if (message.key === 'changed') {
              console.log('Mensaje recibido Online Session Item changed:', message.value);
              this.store.dispatch(setItems({ items: JSON.parse(message.value) }));
            }
          },
          error: error => {
            console.log('[DEBUG] Error when message come:', error);
            this.doReconnect = false;
          }
        }),
        catchError((error) => {
          console.log('[DEBUG] Error to connect:', error);
          this.doReconnect = false;
          this.state = WsConnectionState.DISCONNECTED;
          return EMPTY;
        })
      ).subscribe();
    }
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      retryWhen(errors =>
        errors.pipe(
          scan((acc) => {
            console.log("attempt " + acc);
            return acc + 1;
          }, 1),
          take(3),
          delayWhen(val => timer(val * 5000)),
          tap(val => {
            console.log('[Data Service] Try to reconnect', val)
            if (val >= 3) {
              this.doReconnect = false;
              this.state = WsConnectionState.DISCONNECTED;
            }
          })
        )
      )
    );
  }

  private getNewWebSocket(sessionId: string): WebSocketSubject<{}> {
    const username = localStorage.getItem('username');
    const url = `${this.configService.getConfig().onlineSession?.backends.ws}/${sessionId}/${username}`;
    console.log('Online Session get Websocket connection:', url);
    return webSocket({
        url: url,
        openObserver: {
          next: () => {
            console.log('[DataService]: connection ok');
          }
        },
        closeObserver: {
          next: () => {
            console.log('[DataService]: connection closed');
            this.socket$ = undefined;
            if (this.doReconnect) {
              this.state = WsConnectionState.RECONNECTING;
              this.connect(sessionId, { reconnect: false });
            }
            if (![
              WsConnectionState.CLOSED,
              WsConnectionState.RECONNECTING,
              WsConnectionState.NOTFOUND
            ].includes(this.state)) {
              this.state = WsConnectionState.DISCONNECTED;
            }
          }
        }
      });
  }

  sendMessage(msg: any): void {
    this.socket$?.next(msg);
  }

  close(estadoEspecifico?: WsConnectionState): void {
    if (this.socket$) {
      this.state = estadoEspecifico ? estadoEspecifico : WsConnectionState.CLOSED;
      this.doReconnect = false;
      this.socket$.complete();
      this.socket$ = undefined;
      localStorage.clear();
    }
  }

  get state(): WsConnectionState {
    return this.subjectState.getValue();
  }

  set state(newState: WsConnectionState) {
    console.log('[DEBUG] Cambio de estado:', newState);
    this.subjectState.next(newState);
  }

  ngOnDestroy(): void {
    console.log('[DEBUG] Destruyendo servicio de iniciativa online.');
    this.state = WsConnectionState.CONNECTING;
    this.close();
  }

  new(onlineSession: IOnlineSesion) {
    const formatedItems = {
      ...onlineSession,
      procesar: {
        ...onlineSession.procesar,
        items: JSON.stringify(onlineSession.procesar.items)
      }
    };
    return this.http.post<IOnlineSesion>(this.configService.getConfig().onlineSession?.backends.apiRest, formatedItems)
      .pipe(
        map((newOnlineSession: any) => (<IOnlineSesion>{ ...newOnlineSession, procesar: { ...newOnlineSession?.procesar, items: JSON.parse(newOnlineSession?.procesar['items'] || '{}') } }))
      );
  }

  findById(sessionId: number) {
    return this.http.get(`${this.configService.getConfig().onlineSession?.backends.apiRest}/${sessionId}`)
      .pipe(
        map((onlineSession: any) => (<IOnlineSesion>{ ...onlineSession, procesar: { ...onlineSession?.procesar, items: JSON.parse(onlineSession?.procesar['items'] || '{}') } }))
      );
  }
}
