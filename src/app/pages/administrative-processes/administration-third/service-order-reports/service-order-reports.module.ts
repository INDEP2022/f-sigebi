import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceOrderReportsRoutingModule } from './service-order-reports-routing.module';
import { ServiceOrderReportsComponent } from './service-order-reports/service-order-reports.component';

@NgModule({
  declarations: [ServiceOrderReportsComponent],
  imports: [
    CommonModule,
    ServiceOrderReportsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ServiceOrderReportsModule {}
