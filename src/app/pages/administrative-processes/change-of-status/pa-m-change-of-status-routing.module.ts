import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaCsCChangeOfStatusComponent } from './pa-cs-c-change-of-status/pa-cs-c-change-of-status.component';

const routes: Routes = [
  {
    path: '',
    component: PaCsCChangeOfStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMChangeOfStatusRoutingModule {}
