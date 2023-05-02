import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceptionSchedulingServiceOrderModule } from '../reception-scheduling-service-order/reception-scheduling-service-order.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
import { AprobateImplementReportFormComponent } from './aprobate-implement-report-form/aprobate-implement-report-form.component';
import { AprobateImplementReportServiceFormComponent } from './aprobate-implement-report-service-form/aprobate-implement-report-service-form.component';
import { AprobateServiceOrderFormComponent } from './aprobate-service-order-form/aprobate-service-order-form.component';
import { CaptureServiceOrderFormComponent } from './capture-service-order-form/capture-service-order-form.component';
import { CounterProposalReportSentComponent } from './counter-proposal-report-sent/counter-proposal-report-sent.component';
import { DeliverySchedulingServiceListComponent } from './delivery-scheduling-service-list/delivery-scheduling-service-list.component';
import { DeliverySchedulingServiceRoutingModule } from './delivery-scheduling-service-routing.module';
import { JustificationProposalRejectedComponent } from './justification-proposal-rejected-form/justification-proposal-rejected-form.component';
import { JustificationProposalSentFormComponent } from './justification-proposal-sent-form/justification-proposal-sent-form.component';
import { OrderServiceDeliveryFormComponent } from './order-service-delivery-form/order-service-delivery-form.component';
import { ProposalReportRejectedComponent } from './proposal-report-rejected/proposal-report-rejected.component';
import { ProposalReportSentComponent } from './proposal-report-sent/proposal-report-sent.component';
import { RejectedServiceProposalsFormComponent } from './rejected-service-proposals-form/rejected-service-proposals-form.component';
import { ReportServiceOrderFormComponent } from './report-service-order-form/report-service-order-form.component';
import { ValidateImplementReportFormComponent } from './validate-implement-report-form/validate-implement-report-form.component';
import { ValidateServiceOrderFormComponent } from './validate-service-order-form/validate-service-order-form.component';

@NgModule({
  declarations: [
    CaptureServiceOrderFormComponent,
    DeliverySchedulingServiceListComponent,
    OrderServiceDeliveryFormComponent,
    ValidateServiceOrderFormComponent,
    AprobateServiceOrderFormComponent,
    ReportServiceOrderFormComponent,
    ValidateImplementReportFormComponent,
    AprobateImplementReportServiceFormComponent,
    AprobateImplementReportFormComponent,
    RejectedServiceProposalsFormComponent,
    JustificationProposalRejectedComponent,
    JustificationProposalSentFormComponent,
    ProposalReportRejectedComponent,
    ProposalReportSentComponent,
    CounterProposalReportSentComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    DeliverySchedulingServiceRoutingModule,
    ModalModule.forRoot(),
    ReceptionSchedulingServiceOrderModule,
    SharedRequestModule,
  ],
})
export class DeliverySchedulingServiceModule {}
