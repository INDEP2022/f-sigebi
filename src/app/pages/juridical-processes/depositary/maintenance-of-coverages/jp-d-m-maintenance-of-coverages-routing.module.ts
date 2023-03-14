import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDMcCMaintenanceOfCoveragesComponent } from './jp-d-mc-c-maintenance-of-coverages/jp-d-mc-c-maintenance-of-coverages.component';

const routes: Routes = [
  {
    path: '',
    component: JpDMcCMaintenanceOfCoveragesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMMaintenanceOfCoveragesRoutingModule {}
