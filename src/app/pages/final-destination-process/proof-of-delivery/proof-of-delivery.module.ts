import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalExpedientGenerateComponent } from './modal-expedient-generate/modal-expedient-generate.component';
import { ModalGoodDonationComponent } from './modal-good-donation/modal-good-donation.component';
import { ModalSearchActsComponent } from './modal-search-acts/modal-search-acts.component';
import { ProofOfDeliveryComponent } from './proof of delivery/proof-of-delivery.component';
import { ProofOfDeliveryRoutingModule } from './proof-of-delivery-routing.module';

@NgModule({
  declarations: [
    ProofOfDeliveryComponent,
    ModalSearchActsComponent,
    ModalExpedientGenerateComponent,
    ModalGoodDonationComponent,
  ],
  imports: [
    CommonModule,
    ProofOfDeliveryRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class ProofOfDeliveryModule {}
