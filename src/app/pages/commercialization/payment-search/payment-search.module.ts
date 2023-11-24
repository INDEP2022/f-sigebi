import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentSearchListComponent } from './payment-search-list/payment-search-list.component';
import { PaymentSearchModalComponent } from './payment-search-modal/payment-search-modal.component';
import { PaymentSearchProcessComponent } from './payment-search-process/payment-search-process.component';
import { PaymentSearchRoutingModule } from './payment-search-routing.module';

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
    PaymentSearchListComponent,
    PaymentSearchModalComponent,
    PaymentSearchProcessComponent,
  ],
  imports: [
    CommonModule,
    PaymentSearchRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    NgScrollbarModule,
    CustomSelectComponent,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class PaymentSearchModule {}
