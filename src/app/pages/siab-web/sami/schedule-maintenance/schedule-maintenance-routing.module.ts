import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleMaintenanceComponent } from './schedule-maintenance/schedule-maintenance.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleMaintenanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleMaintenanceRoutingModule {}
