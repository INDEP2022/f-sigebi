import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpAbeeCActsGoodsDeliveredComponent } from './acts-goods-delivered/fdp-abee-c-acts-goods-delivered.component';

const routes: Routes = [
  {
    path: '',
    component: FdpAbeeCActsGoodsDeliveredComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpAbeeMActsGoodsDeliveredRoutingModule {}
