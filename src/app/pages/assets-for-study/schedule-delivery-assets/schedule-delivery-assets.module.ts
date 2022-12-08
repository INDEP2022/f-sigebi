import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AfsSharedComponentsModule } from '../afs-shared-components/afs-shared-components.module';
import { ProgrammingDeliveryComponent } from './programming-delivery/programming-delivery.component';
import { ScheduleDeliveryAssetsRoutingModule } from './schedule-delivery-assets-routing.module';
import { ScheduleDeliveryComponent } from './schedule-delivery/schedule-delivery.component';

@NgModule({
  declarations: [ScheduleDeliveryComponent, ProgrammingDeliveryComponent],
  imports: [
    CommonModule,
    ScheduleDeliveryAssetsRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    AfsSharedComponentsModule,
    SharedRequestModule,
    TabsModule,
  ],
})
export class ScheduleDeliveryAssetsModule {}
