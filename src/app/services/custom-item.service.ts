import { Injectable } from '@angular/core';
import * as objectPath from 'object-path';

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

  baseSetValue(element: any, key: string, value: any): any {
    console.log('Base Set Value:', element, key);
    let elementToChange = JSON.parse(JSON.stringify(element));
    objectPath.set(elementToChange, key, value);
    console.log('Changed element:', elementToChange);
    return elementToChange;
  }
}
