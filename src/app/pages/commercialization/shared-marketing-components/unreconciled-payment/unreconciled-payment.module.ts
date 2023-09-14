import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { UnreconciledPaymentRoutingModule } from './unreconciled-payment-routing.module';
//Components
import { NgxCurrencyModule } from 'ngx-currency';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { NewAndUpdateComponent } from './unreconciled-payment/new-and-update/new-and-update.component';
import { UnreconciledPaymentComponent } from './unreconciled-payment/unreconciled-payment.component';
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
  declarations: [UnreconciledPaymentComponent, NewAndUpdateComponent],
  imports: [
    CommonModule,
    UnreconciledPaymentRoutingModule,
    SharedModule,
    FormLoaderComponent,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class UnreconciledPaymentModule {}
