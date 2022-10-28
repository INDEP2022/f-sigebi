import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpCrdCCheckDocumentaryRequirementsComponent } from './check-documentary-requirements/fdp-crd-c-check-documentary-requirements.component';
import { ModalComponentComponent } from './check-documentary-requirements/modal-component/modal-component.component';
import { FdpAdpdtDetailDelegationsComponent } from './detail-delegations/fdp-adpdt-detail-delegations.component';
import { ImpressionOfActsComponent } from './impression-of-acts/impression-of-acts.component';
import { SharedFinalDestinationRoutingModule } from './shared-final-destination-routing.module';

@NgModule({
  declarations: [
    ImpressionOfActsComponent,
    FdpAdpdtDetailDelegationsComponent,
    FdpCrdCCheckDocumentaryRequirementsComponent,
    ModalComponentComponent,
  ],
  imports: [CommonModule, SharedModule, SharedFinalDestinationRoutingModule],
  exports: [
    ImpressionOfActsComponent,
    FdpAdpdtDetailDelegationsComponent,
    FdpCrdCCheckDocumentaryRequirementsComponent,
  ],
})
export class SharedFinalDestinationModule {}
