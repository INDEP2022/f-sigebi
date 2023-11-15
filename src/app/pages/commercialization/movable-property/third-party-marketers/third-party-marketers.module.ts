import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NgxCurrencyModule } from 'ngx-currency';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { AmountThirdModalComponent } from './amount-third-modal/amount-third-modal.component';
import { ThirdPartyMarketersRoutingModule } from './third-party-marketers-routing.module';
import { ThirdPartyMarketersComponent } from './third-party-marketers/third-party-marketers.component';
import { ThirdPartyModalComponent } from './third-party-modal/third-party-modal.component';
import { TypeEventModalComponent } from './type-event-modal/type-event-modal.component';
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
    ThirdPartyMarketersComponent,
    ThirdPartyModalComponent,
    TypeEventModalComponent,
    AmountThirdModalComponent,
  ],
  imports: [
    CommonModule,
    ThirdPartyMarketersRoutingModule,
    SharedModule,
    FormLoaderComponent,
    ModalModule.forChild(),
    AccordionModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class ThirdPartyMarketersModule {}
