import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaMcsCMassiveChangeStatusComponent } from './pa-mcs-c-massive-change-status/pa-mcs-c-massive-change-status.component';

const routes: Routes = [
  {
    path: '',
    component: PaMcsCMassiveChangeStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMMassiveChangeStatusRoutingModule {}
