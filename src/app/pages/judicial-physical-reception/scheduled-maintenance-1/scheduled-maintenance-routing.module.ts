import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduledMaintenanceDetailComponent } from './scheduled-maintenance-detail/scheduled-maintenance-detail.component';
import { ScheduledMaintenanceComponent } from './scheduled-maintenance.component';

const routes: Routes = [
  { path: '', component: ScheduledMaintenanceComponent },
  { path: 'detail', component: ScheduledMaintenanceDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduledMaintenanceRoutingModule {}
