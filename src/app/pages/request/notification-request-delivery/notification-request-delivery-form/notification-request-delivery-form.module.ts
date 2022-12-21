import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationRequestDeliveryformRoutingModule } from './notification-request-delivery-form-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationRequestDeliveryformRoutingModule,
    SharedModule,
  ],
})
export class NotificationRequestDeliveryFormModule {}
