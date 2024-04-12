import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegionalDelegateImplementationReportFormComponent } from './regional-delegate-implementation-report-form/regional-delegate-implementation-report-form.component';
import { RejectedReportImplementFormComponent } from './rejected-report-implement-form/rejected-report-implement-form.component';
import { RejectedServiceProposalFormComponent } from './rejected-service-proposal-form/rejected-service-proposal-form.component';
import { ServiceOrderRequestAprobateFormComponent } from './service-order-request-aprobate-form/service-order-request-aprobate-form.component';
import { ServiceOrderRequestImplementFormComponent } from './service-order-request-implement-form/service-order-request-implement-form.component';
import { ServiceOrderRequestRejectedFormComponent } from './service-order-request-rejected-form/service-order-request-rejected-form.component';
import { ValidateReportImplementFormComponent } from './validate-report-implement-form/validate-report-implement-form.component';
import { ServiceOrderTaskComponent } from './service-order-task/service-order-task.component';

const routes: Routes = [
  {
    path: ':process/:id',
    component: ServiceOrderTaskComponent,
  }/*,
  {
    path: 'service-order-validation/:id',
    component: ServiceOrderTaskComponent,
  },
  {
    path: 'service-order-aproval/:id',
    component: ServiceOrderRequestAprobateFormComponent,
  },
  {
    path: 'service-order-report/:id',
    component: ServiceOrderRequestImplementFormComponent,
  },
  {
    path: 'service-order-report-validation/:id',
    component: ValidateReportImplementFormComponent,
  },
  {
    path: 'service-order-report-signature/:id',
    component: RegionalDelegateImplementationReportFormComponent,
  },
  {
    path: 'service-order-report-aprove/:id',
    component: ServiceOrderRequestRejectedFormComponent,
  },
  {
    path: 'service-order-validation-justification/:id',
    component: RejectedServiceProposalFormComponent,
  },
  {
    path: 'service-order-report-reject/:id',
    component: RejectedReportImplementFormComponent,
  },*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionSchedulingServiceOrderRoutingModule { }
