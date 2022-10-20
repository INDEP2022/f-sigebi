import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaPcpCLegalRegularizationComponent } from './pa-pcp-c-legal-regularization/pa-pcp-c-legal-regularization.component';
import { PaPcpCPaymentClaimProcessComponent } from './pa-pcp-c-payment-claim-process/pa-pcp-c-payment-claim-process.component';

const routes: Routes = [
  {
    path: '',
    component: PaPcpCPaymentClaimProcessComponent,
  },
  {
    path: 'legal-regularization',
    component: PaPcpCLegalRegularizationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMPaymentClaimProcessRoutingModule {}
