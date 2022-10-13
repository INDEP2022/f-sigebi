import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CBRpMReferencedPaymentRoutingModule } from './c-b-rp-m-referenced-payment-routing.module';
//Components
import { CBRpCReferencedPaymentComponent } from './referenced-payment/c-b-rp-c-referenced-payment.component';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';

@NgModule({
  declarations: [
    CBRpCReferencedPaymentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    CBRpMReferencedPaymentRoutingModule,
    EventsSharedComponent,
    BanksSharedComponent
  ]
})
export class CBRpMReferencedPaymentModule { }
