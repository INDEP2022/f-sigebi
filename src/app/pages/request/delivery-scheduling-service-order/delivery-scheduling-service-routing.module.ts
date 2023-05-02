import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AprobateImplementReportFormComponent } from './aprobate-implement-report-form/aprobate-implement-report-form.component';
import { AprobateImplementReportServiceFormComponent } from './aprobate-implement-report-service-form/aprobate-implement-report-service-form.component';
import { AprobateServiceOrderFormComponent } from './aprobate-service-order-form/aprobate-service-order-form.component';
import { CaptureServiceOrderFormComponent } from './capture-service-order-form/capture-service-order-form.component';
import { CounterProposalReportSentComponent } from './counter-proposal-report-sent/counter-proposal-report-sent.component';
import { DeliverySchedulingServiceListComponent } from './delivery-scheduling-service-list/delivery-scheduling-service-list.component';
import { JustificationProposalRejectedComponent } from './justification-proposal-rejected-form/justification-proposal-rejected-form.component';
import { JustificationProposalSentFormComponent } from './justification-proposal-sent-form/justification-proposal-sent-form.component';
import { ProposalReportRejectedComponent } from './proposal-report-rejected/proposal-report-rejected.component';
import { ProposalReportSentComponent } from './proposal-report-sent/proposal-report-sent.component';
import { RejectedServiceProposalsFormComponent } from './rejected-service-proposals-form/rejected-service-proposals-form.component';
import { ReportServiceOrderFormComponent } from './report-service-order-form/report-service-order-form.component';
import { ValidateImplementReportFormComponent } from './validate-implement-report-form/validate-implement-report-form.component';
import { ValidateServiceOrderFormComponent } from './validate-service-order-form/validate-service-order-form.component';
const routes: Routes = [
  {
    path: 'list',
    component: DeliverySchedulingServiceListComponent,
  },

  {
    path: 'capture-service-order/:id',
    component: CaptureServiceOrderFormComponent,
  },
  {
    path: 'validate-service-order/:id',
    component: ValidateServiceOrderFormComponent,
  },
  {
    path: 'aprobate-service-order/:id',
    component: AprobateServiceOrderFormComponent,
  },
  {
    path: 'report-implement-service/:id',
    component: ReportServiceOrderFormComponent,
  },
  {
    path: 'validate-report-implement/:id',
    component: ValidateImplementReportFormComponent,
  },
  {
    path: 'aprobate-report-implement-service/:id',
    component: AprobateImplementReportServiceFormComponent,
  },
  {
    path: 'aprobate-report-implement/:id',
    component: AprobateImplementReportFormComponent,
  },
  {
    path: 'proposal-service-rejected/:id',
    component: RejectedServiceProposalsFormComponent,
  },
  {
    path: 'justify-service-sent/:id',
    component: JustificationProposalSentFormComponent,
  },
  {
    path: 'justify-service-rejected/:id',
    component: JustificationProposalRejectedComponent,
  },

  {
    path: 'proposal-report-rejected/:id',
    component: ProposalReportRejectedComponent,
  },
  {
    path: 'proposal-report-sent/:id',
    component: ProposalReportSentComponent,
  },

  {
    path: 'reject-order-service/:id',
    component: ProposalReportSentComponent,
  },

  {
    path: 'counter-proposal-implemet-sent/:id',
    component: CounterProposalReportSentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeliverySchedulingServiceRoutingModule {}
