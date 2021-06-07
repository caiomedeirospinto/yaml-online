import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProcesarComponent } from './procesar/procesar.component';
import { DashboardComponent, DialogElementDetail } from './dashboard/dashboard.component';
import { StoreModule } from '@ngrx/store';
import { procesarReducer } from 'src/app/procesar/procesar.reducer';
import { CodeEditorModule } from '@ngstack/code-editor';
import { ItemsProgressBarComponent } from './items-progress-bar/items-progress-bar.component';
import { ConfigureFormComponent } from './procesar/configure-form/configure-form.component';

@NgModule({
  declarations: [
    AppComponent,
    ProcesarComponent,
    DashboardComponent,
    DialogElementDetail,
    ItemsProgressBarComponent,
    ConfigureFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    StoreModule.forRoot({ procesar: procesarReducer }),
    CodeEditorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
