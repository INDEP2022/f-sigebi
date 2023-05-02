import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceOrdersFormatHistoricComponent } from './service-orders-format-historic/service-orders-format-historic.component';
import { ServiceOrdersFormatRoutingModule } from './service-orders-format-routing.module';
import { ServiceOrdersFormatComponent } from './service-orders-format/service-orders-format.component';

@NgModule({
  declarations: [
    ServiceOrdersFormatComponent,
    ServiceOrdersFormatHistoricComponent,
  ],
  exports: [ServiceOrdersFormatHistoricComponent],
  imports: [
    CommonModule,
    ServiceOrdersFormatRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ServiceOrdersFormatModule {}
