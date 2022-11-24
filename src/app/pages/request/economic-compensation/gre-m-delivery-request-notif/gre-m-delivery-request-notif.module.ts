import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { GreCDeliveryRequestNotifMainComponent } from './gre-c-delivery-request-notif-main/gre-c-delivery-request-notif-main.component';
import { GreMDeliveryRequestNotifRoutingModule } from './gre-m-delivery-request-notif-routing.module';

@NgModule({
  declarations: [GreCDeliveryRequestNotifMainComponent],
  imports: [
    CommonModule,
    GreMDeliveryRequestNotifRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class GreMDeliveryRequestNotifModule {}
