import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScheduleNotifyFormComponent } from './schedule-notify-form/schedule-notify-form.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleNotifyFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleNotifyRoutingModule {}
