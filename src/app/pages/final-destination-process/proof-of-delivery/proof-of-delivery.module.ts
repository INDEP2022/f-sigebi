import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodDonationsModalComponent } from './good-donations-modal/good-donations-modal.component';
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
    GoodDonationsModalComponent,
  ],
  imports: [
    CommonModule,
    ProofOfDeliveryRoutingModule,
    SharedModule,
    FormsModule,
    ScanFileSharedComponent,
  ],
})
export class ProofOfDeliveryModule {}
