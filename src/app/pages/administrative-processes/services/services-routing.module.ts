import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DescriptionOfTheMatterComponent } from './description-of-the-matter/description-of-the-matter.component';
//Components
import { GlobalServicePaymentComponent } from './global-service-payments/global-service-payment.component';
import { ImplementationReportsInvoicesComponent } from './implementation-reports-invoices/implementation-reports-invoices.component';
import { RecordServicePaymentComponent } from './record-service-payments/record-service-payment.component';
import { RequestServicePaymentComponent } from './request-service-payments/request-service-payment.component';
import { ServiceMonitoringComponent } from './service-monitoring/service-monitoring.component';

const routes: Routes = [
  {
    path: 'service-monitoring',
    component: ServiceMonitoringComponent,
  },
  {
    path: 'request-service-payments',
    component: RequestServicePaymentComponent,
  },
  {
    path: 'record-service-payments',
    component: RecordServicePaymentComponent,
  },
  {
    path: 'global/:requestId',
    component: GlobalServicePaymentComponent,
  },
  {
    path: 'descripcion-of-the-matter',
    component: DescriptionOfTheMatterComponent,
  },
  {
    path: 'implementation-reports-invoices',
    component: ImplementationReportsInvoicesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSMServicesRoutingModule {}
