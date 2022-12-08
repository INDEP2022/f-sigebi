import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwComerCProofDeliveryComponent } from './sw-comer-c-proof-delivery/sw-comer-c-proof-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: SwComerCProofDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwComerMProofDeliveryRoutingModule {}
