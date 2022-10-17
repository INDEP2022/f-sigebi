import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaleGoodsComponent } from './sale-goods/sale-goods.component';

const routes: Routes = [
  {
    path: '',
    component: SaleGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleGoodsRoutingModule {}
