import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: async () =>
      (
        await import(
          './notification-request-delivery-form/notification-request-delivery-form.module'
        )
      ).NotificationRequestDeliveryFormModule,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationRequestDeliveryRoutingModule {}
