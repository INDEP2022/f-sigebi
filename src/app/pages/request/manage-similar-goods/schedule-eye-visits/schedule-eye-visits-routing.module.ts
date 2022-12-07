import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleEyeVisitsComponent } from './schedule-eye-visits/schedule-eye-visits.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleEyeVisitsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleEyeVisitsRoutingModule {}
