import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { DeliveryRequestNotifMainComponent } from './delivery-request-notif-main/delivery-request-notif-main.component';
import { DeliveryRequestNotifRoutingModule } from './delivery-request-notif-routing.module';

@NgModule({
  declarations: [DeliveryRequestNotifMainComponent],
  imports: [
    CommonModule,
    DeliveryRequestNotifRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class DeliveryRequestNotifModule {}
