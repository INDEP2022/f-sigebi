import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { SharedComponentGsssoModule } from '../shared-component-gssso/shared-component-gssso.module';
import { GenerateFormatsVerificationNoncomplianceRoutingComponent } from './generate-formats-verification-noncompliance-routing.component';
import { ListServiceOrdersComponent } from './list-service-orders/list-service-orders.component';
import { NewDocumentServiceOrdersFormComponent } from './new-document-service-orders-form/new-document-service-orders-form.component';
import { ReviewResultsComponent } from './review-results/review-results.component';
import { SamplingDetailReviewResultsComponent } from './sampling-detail-review-results/sampling-detail-review-results.component';
import { ServiceOrdersFilterComponent } from './service-orders-filter/service-orders-filter.component';
import { UploadExpedientServiceOrderComponent } from './upload-expedient-service-order/upload-expedient-service-order.component';

@NgModule({
  declarations: [
    ReviewResultsComponent,
    SamplingDetailReviewResultsComponent,
    ServiceOrdersFilterComponent,
    ListServiceOrdersComponent,
    UploadExpedientServiceOrderComponent,
    NewDocumentServiceOrdersFormComponent,
  ],
  imports: [
    CommonModule,
    GenerateFormatsVerificationNoncomplianceRoutingComponent,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    SharedComponentGsssoModule,
    TabsModule,
  ],
})
export class GenerateFormatsVerificationNoncomplianceModule {}
