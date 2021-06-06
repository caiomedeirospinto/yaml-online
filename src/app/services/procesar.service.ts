import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/internal/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcesarService {

  constructor(private http: HttpClient) { }

  getYamls(url: string, itemsField?: string): Observable<any> {
    return this.http.get(url)
      .pipe(
        tap(response => console.log('Get Yamls - Response:', response)),
        map((response: any) => {
          if (itemsField) {
            return response[itemsField];
          }
          return response;
        })
      );
  }
}
