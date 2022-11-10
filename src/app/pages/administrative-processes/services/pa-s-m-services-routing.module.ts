import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DescriptionOfTheMatterComponent } from './description-of-the-matter/description-of-the-matter.component';
//Components
import { PaGspCGlobalServicePaymentComponent } from './global-service-payments/pa-gsp-c-global-service-payment.component';
import { ImplementationReportsInvoicesComponent } from './implementation-reports-invoices/implementation-reports-invoices.component';
import { PaRspCRecordServicePaymentComponent } from './record-service-payments/pa-rsp-c-record-service-payment.component';
import { PaRspCRequestServicePaymentComponent } from './request-service-payments/pa-rsp-c-request-service-payment.component';
import { PaSmCServiceMonitoringComponent } from './service-monitoring/pa-sm-c-service-monitoring.component';

const routes: Routes = [
  {
    path: 'service-monitoring',
    component: PaSmCServiceMonitoringComponent,
  },
  {
    path: 'request-service-payments',
    component: PaRspCRequestServicePaymentComponent,
  },
  {
    path: 'record-service-payments',
    component: PaRspCRecordServicePaymentComponent,
  },
  {
    path: 'global/:requestId',
    component: PaGspCGlobalServicePaymentComponent,
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
