import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIReceptionAndDeliveryComponent } from './gp-i-reception-and-delivery/gp-i-reception-and-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: GpIReceptionAndDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIReceptionAndDeliveryRoutingModule {}
