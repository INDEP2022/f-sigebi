import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleReceptionFormComponent } from './schedule-reception-form/schedule-reception-form.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleReceptionFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleReceptionRoutingModule {}
