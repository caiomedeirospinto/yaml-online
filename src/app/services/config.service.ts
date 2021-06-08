import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) { }

  public loadConfig(): Promise<any> {
    return this.http.get(`./assets/config/config.json`)
      .toPromise()
      .then((config: any) => {
        this.config = config;
        console.log('[DEBUG] Configuración cargada: ', this.config);
      })
      .catch((err: any) => {
        console.error('[ERROR] Error al cargar archivo de configuración: ', err);
      });
  }

  public getConfig(): any {
    return this.config;
  }
}
