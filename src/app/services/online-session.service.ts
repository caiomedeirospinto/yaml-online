import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, Subject, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, switchAll, tap } from 'rxjs/internal/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { IOnlineSesion } from '../models/online-sesion';
import { WsConnectionState } from '../models/ws-connection-state';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class OnlineSessionService implements OnDestroy {

  private readonly subjectState = new BehaviorSubject<WsConnectionState>(WsConnectionState.CONNECTING);
  public readonly state$ = this.subjectState.asObservable();

  private socket$: WebSocketSubject<any> | undefined;
  private changesSubject$ = new Subject<any>();

  public changes$ = this.changesSubject$.pipe(switchAll(), catchError(e => { throw e; }));
  public doReconnect = false;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  public connect(sessionId: string, username: string, cfg: { reconnect: boolean } = { reconnect: false }): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket(sessionId, username);
      const changes = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
        tap({
          next: (data: any) => {
            console.log('[DEBUG] Mensaje recibido: ', data);
            if (data.value === '404') {
              this.close(WsConnectionState.NOTFOUND);
            }

            if (data.key === 'init') {
              this.state = WsConnectionState.CONNECTED;
              this.doReconnect = true;
            }
          },
          error: error => {
            console.log('[DEBUG] Error when message come:', error);
            this.doReconnect = false;
          }
        }),
        catchError(_ => EMPTY)
      );
      this.changesSubject$.next(changes);
    }
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log('[Data Service] Try to reconnect', val)),
      delayWhen(_ => timer(500)))));
  }

  private getNewWebSocket(sessionId: string, username: string): WebSocketSubject<{}> {
    return webSocket({
        url: `${this.configService.getConfig().onlineSession?.backends.ws}/${sessionId}/${username}`,
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
              this.connect(sessionId, username, { reconnect: true });
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
    return this.http.post(this.configService.getConfig().onlineSession?.backends.apiRest, onlineSession);
  }

  findById(sessionId: number) {
    return this.http.get(`${this.configService.getConfig().onlineSession?.backends.apiRest}/${sessionId}`)
      .pipe(
        map((onlineSession: any) => (<IOnlineSesion>{ ...onlineSession, procesar: { ...onlineSession?.procesar, items: JSON.parse(onlineSession?.procesar['items'] || '{}') } }))
      );
  }
}
