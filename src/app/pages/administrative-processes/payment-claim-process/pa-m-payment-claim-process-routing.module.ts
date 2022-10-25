import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaPcpCPaymentClaimProcessComponent } from './pa-pcp-c-payment-claim-process/pa-pcp-c-payment-claim-process.component';

const routes: Routes = [
  {
    path: '',
    component: PaPcpCPaymentClaimProcessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMPaymentClaimProcessRoutingModule {}
