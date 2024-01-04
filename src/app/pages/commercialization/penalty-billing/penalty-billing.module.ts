import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CancelModalComponent } from './cancel-modal/cancel-modal.component';
import { FolioModalComponent } from './folio-modal/folio-modal.component';
import { PenaltyBillingMainComponent } from './penalty-billing-main/penalty-billing-main.component';
import { PenaltyBillingRoutingModule } from './penalty-billing-routing.module';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};
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
    FormLoaderComponent,
    AccordionModule,
    NgxCurrencyModule,
  ],
})
export class CFpMPenaltyBillingModule {}
