import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
//Routing
import { CBPdmMPaymentDispersionMonitorRoutingModule } from './c-b-pdm-m-payment-dispersion-monitor-routing.module';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
//Components
import { PaPdmAspCAudienceSirsaePaymentsComponent } from './dispersion-payment-details/audience-sirsae-payments/pa-pdm-asp-c-audience-sirsae-payments.component';
import { PaPdmBpCBatchPaymentsComponent } from './dispersion-payment-details/batch-payments/pa-pdm-bp-c-batch-payments.component';
import { PaPdmBCBatchComponent } from './dispersion-payment-details/batch/pa-pdm-b-c-batch.component';
import { PaPdmCeCCheckboxElementComponent } from './dispersion-payment-details/checkbox-element/pa-pdm-ce-c-checkbox-element.component';
import { PaPdmCbpCCompositionBatchPaymentsComponent } from './dispersion-payment-details/composition-batch-payments/pa-pdm-cbp-c-composition-batch-payments.component';
import { PaPdmCpCCustomersPaymentsComponent } from './dispersion-payment-details/customers-payments/pa-pdm-cp-c-customers-payments.component';
import { PaPdmCCCustomersComponent } from './dispersion-payment-details/customers/pa-pdm-c-c-customers.component';
import { PaPdmDbCDesertedBatchComponent } from './dispersion-payment-details/deserted-batch/pa-pdm-db-c-deserted-batch.component';
import { PaPdmOwobCOrderWOBillingComponent } from './dispersion-payment-details/order-w-o-billing-audience/pa-pdm-owob-c-order-w-o-billing.component';
import { PaPdmSpCSirsaePaymentsComponent } from './dispersion-payment-details/sirsae-payments/pa-pdm-sp-c-sirsae-payments.component';
import { CBDpCDispersionPaymentComponent } from './dispersion-payment/c-b-dp-c-dispersion-payment.component';

@NgModule({
  declarations: [
    CBDpCDispersionPaymentComponent,
    PaPdmAspCAudienceSirsaePaymentsComponent,
    PaPdmBCBatchComponent,
    PaPdmBpCBatchPaymentsComponent,
    PaPdmCeCCheckboxElementComponent,
    PaPdmCbpCCompositionBatchPaymentsComponent,
    PaPdmCCCustomersComponent,
    PaPdmCpCCustomersPaymentsComponent,
    PaPdmDbCDesertedBatchComponent,
    PaPdmOwobCOrderWOBillingComponent,
    PaPdmSpCSirsaePaymentsComponent,
  ],
  imports: [
    CommonModule,
    CBPdmMPaymentDispersionMonitorRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    BsDropdownModule,
    ModalModule.forChild(),
    EventsSharedComponent,
  ],
})
export class CBPdmMPaymentDispersionMonitorModule {}
