import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaRspCRecordServicePaymentComponent } from './record-service-payments/pa-rsp-c-record-service-payment.component';
import { PaGspCGlobalServicePaymentComponent } from './global-service-payments/pa-gsp-c-global-service-payment.component';
import { PaRspCRequestServicePaymentComponent } from './request-service-payments/pa-rsp-c-request-service-payment.component';

const routes: Routes = [
  {
    path: '',
    component: PaRspCRecordServicePaymentComponent,
  },
  {
    path: 'request',
    component: PaRspCRequestServicePaymentComponent ,
  },
  {
    path: 'global/:requestId',
    component: PaGspCGlobalServicePaymentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaSMServicesRoutingModule {}
