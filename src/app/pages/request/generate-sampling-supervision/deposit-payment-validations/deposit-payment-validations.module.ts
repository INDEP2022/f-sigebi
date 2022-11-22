import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { DepositPaymentValidationsRoutingModule } from './deposit-payment-validations-routing-module';
import { PaymentValidationsComponent } from './payment-validations/payment-validations.component';

@NgModule({
  declarations: [PaymentValidationsComponent],
  imports: [
    CommonModule,
    DepositPaymentValidationsRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
    SharedComponentGssModule,
  ],
})
export class DepositPaymentValidationsModule {}
