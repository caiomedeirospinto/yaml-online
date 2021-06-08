import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureTogglesService {

  constructor(private configService: ConfigService) { }

  isEnabled(module: string) {
    return this.configService.getConfig()[module]?.enabled;
  }
}
