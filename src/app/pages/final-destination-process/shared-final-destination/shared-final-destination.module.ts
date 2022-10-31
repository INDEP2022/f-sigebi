import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpCrdCCheckDocumentaryRequirementsComponent } from './check-documentary-requirements/fdp-crd-c-check-documentary-requirements.component';
import { ModalComponentComponent } from './check-documentary-requirements/modal-component/modal-component.component';
import { FdpAdpdtDetailDelegationsComponent } from './detail-delegations/fdp-adpdt-detail-delegations.component';
import { ImpressionOfActsComponent } from './impression-of-acts/impression-of-acts.component';
import { SharedFinalDestinationRoutingModule } from './shared-final-destination-routing.module';
import { ModalSelectRequestsComponent } from './view-donation-contracts/modal-select-requests/modal-select-requests.component';
import { ViewDonationContractsComponent } from './view-donation-contracts/view-donation-contracts.component';

@NgModule({
  declarations: [
    ImpressionOfActsComponent,
    FdpAdpdtDetailDelegationsComponent,
    FdpCrdCCheckDocumentaryRequirementsComponent,
    ModalComponentComponent,
    ViewDonationContractsComponent,
    ModalSelectRequestsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    SharedFinalDestinationRoutingModule,
    NgScrollbarModule,
  ],
  exports: [
    ImpressionOfActsComponent,
    FdpAdpdtDetailDelegationsComponent,
    FdpCrdCCheckDocumentaryRequirementsComponent,
    ViewDonationContractsComponent,
  ],
})
export class SharedFinalDestinationModule {}
