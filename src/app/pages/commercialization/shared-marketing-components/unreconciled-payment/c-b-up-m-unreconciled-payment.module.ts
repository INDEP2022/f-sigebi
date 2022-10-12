import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CBUpMUnreconciledPaymentRoutingModule } from './c-b-up-m-unreconciled-payment-routing.module';
//Components
import { CBUpCUnreconciledPaymentComponent } from './unreconciled-payment/c-b-up-c-unreconciled-payment.component';


@NgModule({
  declarations: [
    CBUpCUnreconciledPaymentComponent
  ],
  imports: [
    CommonModule,
    CBUpMUnreconciledPaymentRoutingModule,
    SharedModule
  ]
})
export class CBUpMUnreconciledPaymentModule { }
