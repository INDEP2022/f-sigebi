import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JpDMPendingNotificationsRoutingModule } from './jp-d-m-pending-notifications-routing.module';
import { JpDPnPendingNotificationsComponent } from './jp-d-pn-pending-notifications/jp-d-pn-pending-notifications.component';


@NgModule({
  declarations: [
    JpDPnPendingNotificationsComponent
  ],
  imports: [
    CommonModule,
    JpDMPendingNotificationsRoutingModule
  ]
})
export class JpDMPendingNotificationsModule { }
