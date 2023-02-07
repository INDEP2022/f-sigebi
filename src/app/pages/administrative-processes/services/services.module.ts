import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { PaSMServicesRoutingModule } from './services-routing.module';
//@Standalone Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { RecordsSharedComponent } from 'src/app/@standalone/shared-forms/records-shared/records-shared.component';
import { ServicesSharedComponent } from 'src/app/@standalone/shared-forms/services-shared/services-shared.component';
//Components
import { DescriptionOfTheMatterComponent } from './description-of-the-matter/description-of-the-matter.component';
import { GlobalServicePaymentComponent } from './global-service-payments/global-service-payment.component';
import { GoodsServicePaymentComponent } from './goods-service-payments/goods-service-payment.component';
import { ImplementationReportsInvoicesComponent } from './implementation-reports-invoices/implementation-reports-invoices.component';
import { RecordServicePaymentComponent } from './record-service-payments/record-service-payment.component';
import { RequestServiceFormComponent } from './request-service-form/request-service-form.component';
import { RequestServicePaymentComponent } from './request-service-payments/request-service-payment.component';
import { ServiceMonitoringComponent } from './service-monitoring/service-monitoring.component';

@NgModule({
  declarations: [
    RecordServicePaymentComponent,
    GlobalServicePaymentComponent,
    GoodsServicePaymentComponent,
    RequestServicePaymentComponent,
    RequestServiceFormComponent,
    ServiceMonitoringComponent,
    DescriptionOfTheMatterComponent,
    ImplementationReportsInvoicesComponent,
  ],
  imports: [
    CommonModule,
    PaSMServicesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
    RecordsSharedComponent,
    ServicesSharedComponent,
  ],
})
export class PaSMServicesModule {}
