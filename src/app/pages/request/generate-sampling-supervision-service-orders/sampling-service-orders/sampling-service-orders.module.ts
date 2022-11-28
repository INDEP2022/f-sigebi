import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
//import { AnnexDataComponent } from '../shared-component-gssso/annex-data/annex-data.component';
import { SharedComponentGsssoModule } from '../shared-component-gssso/shared-component-gssso.module';
import { AnnexKComponent } from './annex-k/annex-k.component';
import { GenerateQueryComponent } from './generate-query/generate-query.component';
import { ListServiceOrdersComponent } from './list-service-orders/list-service-orders.component';
import { NewDocumentServiceOrderFormComponent } from './new-document-service-order-form/new-document-service-order-form.component';
import { SamplingServiceOrdersRoutingModule } from './sampling-service-orders-routing.module';
import { UploadExpedientServiceOrderFormComponent } from './upload-expedient-service-order-form/upload-expedient-service-order-form.component';
import { WarehouseDetailComponent } from './warehouse-detail/warehouse-detail.component';

@NgModule({
  declarations: [
    GenerateQueryComponent,
    ListServiceOrdersComponent,
    UploadExpedientServiceOrderFormComponent,
    NewDocumentServiceOrderFormComponent,
    //AnnexDataComponent,
    WarehouseDetailComponent,
    AnnexKComponent,
  ],
  imports: [
    CommonModule,
    SamplingServiceOrdersRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    SharedComponentGsssoModule,
    TabsModule,
  ],
  exports: [ListServiceOrdersComponent],
})
export class SamplingServiceOrdersModule {}
