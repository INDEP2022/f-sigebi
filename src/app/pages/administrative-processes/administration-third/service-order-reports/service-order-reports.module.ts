import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServiceOrderReportsRoutingModule } from './service-order-reports-routing.module';
import { ServiceOrderReportsComponent } from './service-order-reports/service-order-reports.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    ServiceOrderReportsComponent
  ],
  imports: [
    CommonModule,
    ServiceOrderReportsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class ServiceOrderReportsModule { }
