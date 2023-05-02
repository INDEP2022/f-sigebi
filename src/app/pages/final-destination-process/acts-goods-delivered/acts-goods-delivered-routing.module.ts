import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActsGoodsDeliveredComponent } from './acts-goods-delivered/acts-goods-delivered.component';

const routes: Routes = [
  {
    path: '',
    component: ActsGoodsDeliveredComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActsGoodsDeliveredRoutingModule {}
