import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProofOfDeliveryComponent } from './proof of delivery/proof-of-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: ProofOfDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProofOfDeliveryRoutingModule {}
