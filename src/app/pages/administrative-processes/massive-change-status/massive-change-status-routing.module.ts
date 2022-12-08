import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveChangeStatusComponent } from './massive-change-status/massive-change-status.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveChangeStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveChangeStatusRoutingModule {}
