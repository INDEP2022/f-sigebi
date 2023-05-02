import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncidentMaintenanceComponent } from './incident-maintenance/incident-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: IncidentMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncidentMaintenanceRoutingModule {}
