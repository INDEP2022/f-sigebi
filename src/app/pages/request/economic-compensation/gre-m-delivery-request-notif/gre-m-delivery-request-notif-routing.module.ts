import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCDeliveryRequestNotifMainComponent } from './gre-c-delivery-request-notif-main/gre-c-delivery-request-notif-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCDeliveryRequestNotifMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class GreMDeliveryRequestNotifRoutingModule { }
