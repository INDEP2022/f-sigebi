import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIIncidentMaintenanceComponent } from './gp-i-incident-maintenance/gp-i-incident-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: GpIIncidentMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIIncidentMaintenanceRoutingModule {}
