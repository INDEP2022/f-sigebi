import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryRequestNotifMainComponent } from './delivery-request-notif-main/delivery-request-notif-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: DeliveryRequestNotifMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliveryRequestNotifRoutingModule {}
