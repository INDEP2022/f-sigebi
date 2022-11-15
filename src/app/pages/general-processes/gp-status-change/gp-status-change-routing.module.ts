import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpStatusChangeComponent } from './gp-status-change/gp-status-change.component';

const routes: Routes = [
  {
    path: '',
    component: GpStatusChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpStatusChangeRoutingModule {}
