import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { FolioModalComponent } from './folio-modal/folio-modal.component';
import { PenaltyBillingMainComponent } from './penalty-billing-main/penalty-billing-main.component';
import { PenaltyBillingRoutingModule } from './penalty-billing-routing.module';

@NgModule({
  declarations: [
    PenaltyBillingMainComponent,
    FolioModalComponent,
    CancelModalComponent,
  ],
  imports: [
    CommonModule,
    PenaltyBillingRoutingModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forChild(),
    BsDatepickerModule,
  ],
})
export class CFpMPenaltyBillingModule {}
