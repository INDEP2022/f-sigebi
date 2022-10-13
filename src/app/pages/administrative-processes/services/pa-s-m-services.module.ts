import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { PaSMServicesRoutingModule } from './pa-s-m-services-routing.module';
//Components
import { PaRspCRecordServicePaymentComponent } from './record-service-payments/pa-rsp-c-record-service-payment.component';
import { PaGspCGlobalServicePaymentComponent } from './global-service-payments/pa-gsp-c-global-service-payment.component';
import { PaGspCGoodsServicePaymentComponent } from './goods-service-payments/pa-gsp-c-goods-service-payment.component';
//@Standalone Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { RecordsSharedComponent } from 'src/app/@standalone/shared-forms/records-shared/records-shared.component';

@NgModule({
  declarations: [
    PaRspCRecordServicePaymentComponent,
    PaGspCGlobalServicePaymentComponent,
    PaGspCGoodsServicePaymentComponent,
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
  ],
})
export class PaSMServicesModule {}
