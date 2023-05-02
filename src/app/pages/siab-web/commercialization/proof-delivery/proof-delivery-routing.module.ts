import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { proofDeliveryComponent } from './proof-delivery/proof-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: proofDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class proofDeliveryRoutingModule {}
