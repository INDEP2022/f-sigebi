import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServiceOrdersExpedientModalComponent } from './service-orders-expedient-modal/service-orders-expedient-modal.component';
import { ServiceOrdersFormatHistoricComponent } from './service-orders-format-historic/service-orders-format-historic.component';
import { ServiceOrdersFormatRoutingModule } from './service-orders-format-routing.module';
import { ServiceOrdersFormatComponent } from './service-orders-format/service-orders-format.component';
import { ServiceOrdersSelectModalComponent } from './service-orders-select-modal/service-orders-select-modal.component';

@NgModule({
  declarations: [
    ServiceOrdersFormatComponent,
    ServiceOrdersFormatHistoricComponent,
    ServiceOrdersSelectModalComponent,
    ServiceOrdersExpedientModalComponent,
  ],
  exports: [ServiceOrdersFormatHistoricComponent],
  imports: [
    CommonModule,
    ServiceOrdersFormatRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    FormsModule,
    DelegationSharedComponent,
  ],
})
export class ServiceOrdersFormatModule {}
