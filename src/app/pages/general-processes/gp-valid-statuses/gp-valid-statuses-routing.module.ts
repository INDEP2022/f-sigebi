import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpValidStatusesComponent } from './gp-valid-statuses/gp-valid-statuses.component';
const routes: Routes = [
  {
    path: '',
    component: GpValidStatusesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpValidStatusesRoutingModule {}
