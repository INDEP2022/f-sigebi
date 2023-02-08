import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActDeliveryReceptionComponent } from './act-delivery-reception/act-delivery-reception.component';

const routes: Routes = [
  {
    path: '',
    component: ActDeliveryReceptionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActDeliveryReceptionRoutingModule {}
