import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { UnreconciledPaymentRoutingModule } from './unreconciled-payment-routing.module';
//Components
import { UnreconciledPaymentComponent } from './unreconciled-payment/unreconciled-payment.component';

@NgModule({
  declarations: [UnreconciledPaymentComponent],
  imports: [CommonModule, UnreconciledPaymentRoutingModule, SharedModule],
})
export class UnreconciledPaymentModule {}
