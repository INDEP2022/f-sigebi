import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalSearchActsComponent } from './modal-search-acts/modal-search-acts.component';
import { ProofOfDeliveryComponent } from './proof of delivery/proof-of-delivery.component';
import { ProofOfDeliveryRoutingModule } from './proof-of-delivery-routing.module';

@NgModule({
  declarations: [ProofOfDeliveryComponent, ModalSearchActsComponent],
  imports: [
    CommonModule,
    ProofOfDeliveryRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class ProofOfDeliveryModule {}
