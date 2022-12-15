import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { TransfNotificationRoutingModule } from './transf-notification-routing.module';
import { TransfNotificationComponent } from './transf-notification/transf-notification.component';

@NgModule({
  declarations: [TransfNotificationComponent],
  imports: [CommonModule, TransfNotificationRoutingModule, SharedRequestModule],
})
export class TransfNotificationModule {}
