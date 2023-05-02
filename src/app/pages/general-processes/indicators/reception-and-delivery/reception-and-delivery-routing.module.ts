import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceptionAndDeliveryComponent } from './reception-and-delivery/reception-and-delivery.component';

const routes: Routes = [
  {
    path: '',
    component: ReceptionAndDeliveryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceptionAndDeliveryRoutingModule {}
