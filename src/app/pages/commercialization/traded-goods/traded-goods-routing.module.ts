import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradedGoodsComponent } from './traded-goods/traded-goods.component';

const routes: Routes = [
  {
    path: '',
    component: TradedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradedGoodsRoutingModule {}
