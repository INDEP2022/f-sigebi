import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpCoordinationComponent } from './gp-coordination/gp-coordination.component';

const routes: Routes = [
  {
    path: '',
    component: GpCoordinationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpCoordinationRoutingModule {}
