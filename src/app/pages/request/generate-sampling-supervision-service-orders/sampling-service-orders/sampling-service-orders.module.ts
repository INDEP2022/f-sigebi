import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { GenerateQueryComponent } from './generate-query/generate-query.component';
import { SamplingServiceOrdersRoutingModule } from './sampling-service-orders-routing.module';

@NgModule({
  declarations: [GenerateQueryComponent],
  imports: [
    CommonModule,
    SamplingServiceOrdersRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
  ],
})
export class SamplingServiceOrdersModule {}
