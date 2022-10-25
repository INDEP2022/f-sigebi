import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpCdeCProofOfDeliveryComponent } from './proof of delivery/fdp-cde-c-proof-of-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: FdpCdeCProofOfDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpCdeMProofOfDeliveryRoutingModule {}
