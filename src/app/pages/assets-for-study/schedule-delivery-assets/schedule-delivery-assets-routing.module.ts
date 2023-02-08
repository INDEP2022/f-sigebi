import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleDeliveryComponent } from './schedule-delivery/schedule-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleDeliveryAssetsRoutingModule {}
