import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProcesarComponent } from 'src/app/procesar/procesar.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: "",
  component: ProcesarComponent
},
{
  path: "dashboard",
  component: DashboardComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
