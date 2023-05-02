import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionalDelegateImplementationReportFormComponent } from './regional-delegate-implementation-report-form/regional-delegate-implementation-report-form.component';
import { RejectedReportImplementFormComponent } from './rejected-report-implement-form/rejected-report-implement-form.component';
import { RejectedServiceProposalFormComponent } from './rejected-service-proposal-form/rejected-service-proposal-form.component';
import { ServiceOrderRequestAprobateFormComponent } from './service-order-request-aprobate-form/service-order-request-aprobate-form.component';
import { ServiceOrderRequestCaptureFormComponent } from './service-order-request-capture-form/service-order-request-capture-form.component';
import { ServiceOrderRequestImplementFormComponent } from './service-order-request-implement-form/service-order-request-implement-form.component';
import { ServiceOrderRequestRejectedFormComponent } from './service-order-request-rejected-form/service-order-request-rejected-form.component';
import { ServiceOrderRequestValidateFormComponent } from './service-order-request-validate-form/service-order-request-validate-form.component';
import { ValidateReportImplementFormComponent } from './validate-report-implement-form/validate-report-implement-form.component';

const routes: Routes = [
  {
    path: 'service-order-request-capture/:id',
    component: ServiceOrderRequestCaptureFormComponent,
  },
  {
    path: 'service-order-request-validate/:id',
    component: ServiceOrderRequestValidateFormComponent,
  },
  {
    path: 'service-order-request-aprobate/:id',
    component: ServiceOrderRequestAprobateFormComponent,
  },
  {
    path: 'service-order-request-implement/:id',
    component: ServiceOrderRequestImplementFormComponent,
  },
  {
    path: 'validate-report-implement/:id',
    component: ValidateReportImplementFormComponent,
  },
  {
    path: 'validate-report-delegation/:id',
    component: RegionalDelegateImplementationReportFormComponent,
  },
  {
    path: 'service-order-request-rejected/:id',
    component: ServiceOrderRequestRejectedFormComponent,
  },
  {
    path: 'rejected-service-proposal/:id',
    component: RejectedServiceProposalFormComponent,
  },
  {
    path: 'rejected-report-implement/:id',
    component: RejectedReportImplementFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionSchedulingServiceOrderRoutingModule {}
