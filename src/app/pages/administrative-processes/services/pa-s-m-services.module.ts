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
import { PaSMServicesRoutingModule } from './pa-s-m-services-routing.module';
//@Standalone Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { RecordsSharedComponent } from 'src/app/@standalone/shared-forms/records-shared/records-shared.component';
import { ServicesSharedComponent } from 'src/app/@standalone/shared-forms/services-shared/services-shared.component';
//Components
import { PaGspCGlobalServicePaymentComponent } from './global-service-payments/pa-gsp-c-global-service-payment.component';
import { PaGspCGoodsServicePaymentComponent } from './goods-service-payments/pa-gsp-c-goods-service-payment.component';
import { PaRspCRecordServicePaymentComponent } from './record-service-payments/pa-rsp-c-record-service-payment.component';
import { PaRsfCRequestServiceFormComponent } from './request-service-form/pa-rsf-c-request-service-form.component';
import { PaRspCRequestServicePaymentComponent } from './request-service-payments/pa-rsp-c-request-service-payment.component';
import { PaSmCServiceMonitoringComponent } from './service-monitoring/pa-sm-c-service-monitoring.component';
import { DescriptionOfTheMatterComponent } from './description-of-the-matter/description-of-the-matter.component';
import { ImplementationReportsInvoicesComponent } from './implementation-reports-invoices/implementation-reports-invoices.component';

@NgModule({
  declarations: [
    PaRspCRecordServicePaymentComponent,
    PaGspCGlobalServicePaymentComponent,
    PaGspCGoodsServicePaymentComponent,
    PaRspCRequestServicePaymentComponent,
    PaRsfCRequestServiceFormComponent,
    PaSmCServiceMonitoringComponent,
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
