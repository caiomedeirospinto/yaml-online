import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcesarComponent } from './procesar/procesar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogElementDetail } from './dashboard/dialog-element-detail/dialog-element-detail.component';
import { DialogCreateOnlineSession } from './dashboard/dialog-create-online-session/dialog-create-online-session.component';
import { StoreModule } from '@ngrx/store';
import { procesarReducer } from 'src/app/procesar/procesar.reducer';
import { CodeEditorModule } from '@ngstack/code-editor';
import { ItemsProgressBarComponent } from './items-progress-bar/items-progress-bar.component';
import { ConfigureFormComponent } from './procesar/configure-form/configure-form.component';
import { ConfigService } from './services/config.service';

export function initConfig(configService: ConfigService): () => void {
  return () => configService.loadConfig();
}

@NgModule({
  declarations: [
    AppComponent,
    ProcesarComponent,
    DashboardComponent,
    DialogElementDetail,
    ItemsProgressBarComponent,
    ConfigureFormComponent,
    DialogCreateOnlineSession
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    StoreModule.forRoot({ procesar: procesarReducer }),
    CodeEditorModule.forRoot()
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: initConfig, deps: [ConfigService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
