import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { NonDeliveryReasonsFormComponent } from './non-delivery-reasons-form/non-delivery-reasons-form.component';
import { NonDeliveryReasonsListComponent } from './non-delivery-reasons-list/non-delivery-reasons-list.component';
import { NonDeliveryReasonsRoutingModule } from './non-delivery-reasons-routing.module';

@NgModule({
  declarations: [
    NonDeliveryReasonsFormComponent,
    NonDeliveryReasonsListComponent,
  ],
  imports: [
    CommonModule,
    NonDeliveryReasonsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class NonDeliveryReasonsModule {}
