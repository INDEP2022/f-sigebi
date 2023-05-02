import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourtMaintenanceComponent } from './court-maintenance/court-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: CourtMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourtMaintenanceRoutingModule {}
