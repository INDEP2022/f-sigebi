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
import { PaymentDispersionMonitorRoutingModule } from './payment-dispersion-monitor-routing.module';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
//Components
import { CanTimesComponent } from './can-times/can-times.component';
import { ComerPaymentVirtComponent } from './comer-payment-virt/comer-payment-virt.component';
import { AudienceSirsaePaymentsComponent } from './dispersion-payment-details/audience-sirsae-payments/audience-sirsae-payments.component';
import { BatchPaymentsComponent } from './dispersion-payment-details/batch-payments/batch-payments.component';
import { BatchComponent } from './dispersion-payment-details/batch/batch.component';
import { CheckboxElementComponent } from './dispersion-payment-details/checkbox-element/checkbox-element.component';
import { CompositionBatchPaymentsComponent } from './dispersion-payment-details/composition-batch-payments/composition-batch-payments.component';
import { CustomersPaymentsComponent } from './dispersion-payment-details/customers-payments/customers-payments.component';
import { CustomersComponent } from './dispersion-payment-details/customers/customers.component';
import { DesertedBatchComponent } from './dispersion-payment-details/deserted-batch/deserted-batch.component';
import { OrderWOBillingComponent } from './dispersion-payment-details/order-w-o-billing-audience/order-w-o-billing.component';
import { SirsaePaymentsComponent } from './dispersion-payment-details/sirsae-payments/sirsae-payments.component';
import { DispersionPaymentComponent } from './dispersion-payment/dispersion-payment.component';
import { NewComerPaymentVirt } from './new-comer-payment-virt/new-comer-payment-virt.component';
import { CanUsuSirsaeComponent } from './can-usu-sirsae/can-usu-sirsae.component';
import { CanPagosCabComponent } from './can-pagos-cab/can-pago-cab.component'
import { CanLcsWarrantyComponent } from './can-lcs-warranty/can-lcs-warranty.component'
import { CanRelusuComponent } from './can-relusu/can-relusu.component';
import { NewCanRelusuComponent } from './can-relusu/new-can-relusu/new-can-relusu.component';

@NgModule({
  declarations: [
    DispersionPaymentComponent,
    AudienceSirsaePaymentsComponent,
    BatchComponent,
    BatchPaymentsComponent,
    CheckboxElementComponent,
    CompositionBatchPaymentsComponent,
    CustomersComponent,
    CustomersPaymentsComponent,
    DesertedBatchComponent,
    OrderWOBillingComponent,
    SirsaePaymentsComponent,
    ComerPaymentVirtComponent,
    CanTimesComponent,
    NewComerPaymentVirt,
    CanUsuSirsaeComponent,
    CanPagosCabComponent,
    CanLcsWarrantyComponent,
    CanRelusuComponent,
    NewCanRelusuComponent
  ],
  imports: [
    CommonModule,
    PaymentDispersionMonitorRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    BsDropdownModule,
    ModalModule.forChild(),
    EventsSharedComponent,
  ],
})
export class PaymentDispersionMonitorModule {}
