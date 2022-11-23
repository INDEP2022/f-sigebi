import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GreMDeliveryRequestNotifRoutingModule } from './gre-m-delivery-request-notif-routing.module';
import { GreCDeliveryRequestNotifMainComponent } from './gre-c-delivery-request-notif-main/gre-c-delivery-request-notif-main.component';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';


@NgModule({
  declarations: [
    GreCDeliveryRequestNotifMainComponent
  ],
  imports: [
    CommonModule,
    GreMDeliveryRequestNotifRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ]
})
export class GreMDeliveryRequestNotifModule { }
