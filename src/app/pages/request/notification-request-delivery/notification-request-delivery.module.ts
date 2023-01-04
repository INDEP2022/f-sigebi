import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationRequestDeliveryRoutingModule } from './notification-request-delivery-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NotificationRequestDeliveryRoutingModule,
    SharedModule,
  ],
})
export class NotificationRequestDeliveryModule {}
