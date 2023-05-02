import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { GenerateSamplingSupervisionServiceOrdersRoutingModule } from './generate-sampling-supervision-service-orders-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GenerateSamplingSupervisionServiceOrdersRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
  ],
})
export class GenerateSamplingSupervisionServiceOrdersModule {}
