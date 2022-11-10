import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CFpCPenaltyBillingMainComponent } from './c-fp-c-penalty-billing-main/c-fp-c-penalty-billing-main.component';
import { CFpMPenaltyBillingRoutingModule } from './c-fp-m-penalty-billing-routing.module';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { FolioModalComponent } from './folio-modal/folio-modal.component';

@NgModule({
  declarations: [
    CFpCPenaltyBillingMainComponent,
    FolioModalComponent,
    CancelModalComponent,
  ],
  imports: [
    CommonModule,
    CFpMPenaltyBillingRoutingModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forChild(),
    BsDatepickerModule,
  ],
})
export class CFpMPenaltyBillingModule {}
