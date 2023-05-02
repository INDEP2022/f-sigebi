import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotificationRequestDeliveryFormComponent } from './notification-request-delivery-form/notification-request-delivery-form.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationRequestDeliveryFormComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRequestDeliveryformRoutingModule {}
