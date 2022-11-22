import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddressOriginFormComponent } from './components/address-origin-form/address-origin-form.component';
import { AddressTransferentFormComponent } from './components/address-transferent-form/address-transferent-form.component';
import { AnnexWFormComponent } from './components/annex-w-form/annex-w-form.component';
import { ClassificateVehicleFormComponent } from './components/classificate-vehicle-form/classificate-vehicle-form.component';
import { CommentsFormComponent } from './components/comments-form/comments-form.component';
import { CreateClassificateVehicleFormComponent } from './components/create-classificate-vehicle-form/create-classificate-vehicle-form.component';
import { CreateManualServiceFormComponent } from './components/create-manual-service-form/create-manual-service-form.component';
import { CreateServiceFormComponent } from './components/create-service-form/create-service-form.component';
import { DetailServiceOrderComponent } from './components/detail-service-order/detail-service-order.component';
import { GenerateReportFormComponent } from './components/generate-report-form/generate-report-form.component';
import { OrderServiceFormComponent } from './components/order-service-form/order-service-form.component';
import { RejectionCommentFormComponent } from './components/rejection-comment-form/rejection-comment-form.component';
import { RejectionJustifyFormComponent } from './components/rejection-justify-form/rejection-justify-form.component';
import { ServiceTransportableGoodsFormComponent } from './components/service-transportable-goods-form/service-transportable-goods-form.component';
import { TranportableGoodsFormComponent } from './components/tranportable-goods-form/tranportable-goods-form.component';
import { ReceptionSchedulingServiceOrderRoutingModule } from './reception-scheduling-service-order-routing.module';
import { RegionalDelegateImplementationReportFormComponent } from './regional-delegate-implementation-report-form/regional-delegate-implementation-report-form.component';
import { RejectedReportImplementFormComponent } from './rejected-report-implement-form/rejected-report-implement-form.component';
import { RejectedServiceProposalFormComponent } from './rejected-service-proposal-form/rejected-service-proposal-form.component';
import { ServiceOrderRequestAprobateFormComponent } from './service-order-request-aprobate-form/service-order-request-aprobate-form.component';
import { ServiceOrderRequestCaptureFormComponent } from './service-order-request-capture-form/service-order-request-capture-form.component';
import { ServiceOrderRequestImplementFormComponent } from './service-order-request-implement-form/service-order-request-implement-form.component';
import { ServiceOrderRequestRejectedFormComponent } from './service-order-request-rejected-form/service-order-request-rejected-form.component';
import { ServiceOrderRequestValidateFormComponent } from './service-order-request-validate-form/service-order-request-validate-form.component';
import { ValidateReportImplementFormComponent } from './validate-report-implement-form/validate-report-implement-form.component';

@NgModule({
  declarations: [
    ServiceOrderRequestCaptureFormComponent,
    CreateServiceFormComponent,
    CreateManualServiceFormComponent,
    ServiceOrderRequestValidateFormComponent,
    DetailServiceOrderComponent,
    AddressTransferentFormComponent,
    TranportableGoodsFormComponent,
    OrderServiceFormComponent,
    ClassificateVehicleFormComponent,
    CreateClassificateVehicleFormComponent,
    AddressOriginFormComponent,
    CommentsFormComponent,
    ServiceTransportableGoodsFormComponent,
    GenerateReportFormComponent,
    ServiceOrderRequestAprobateFormComponent,
    ServiceOrderRequestImplementFormComponent,
    ValidateReportImplementFormComponent,
    AnnexWFormComponent,
    RegionalDelegateImplementationReportFormComponent,
    ServiceOrderRequestRejectedFormComponent,
    RejectionCommentFormComponent,
    RejectionJustifyFormComponent,
    RejectedServiceProposalFormComponent,
    RejectedReportImplementFormComponent,
  ],
  imports: [
    CommonModule,
    ReceptionSchedulingServiceOrderRoutingModule,
    SharedModule,
    TabsModule,
    ModalModule.forRoot(),
  ],
})
export class ReceptionSchedulingServiceOrderModule {}
