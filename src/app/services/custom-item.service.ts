import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomItemService {
  baseGetValue(element: any, key: string): string {
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
  }
}
