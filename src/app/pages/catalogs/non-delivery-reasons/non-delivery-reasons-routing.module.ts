import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonDeliveryReasonsListComponent } from './non-delivery-reasons-list/non-delivery-reasons-list.component';

const routes: Routes = [
  {
    path: '',
    component: NonDeliveryReasonsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonDeliveryReasonsRoutingModule {}
