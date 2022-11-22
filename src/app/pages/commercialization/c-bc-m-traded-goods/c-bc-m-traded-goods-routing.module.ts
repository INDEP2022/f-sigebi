import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBcCTradedGoodsComponent } from './c-bc-c-traded-goods/c-bc-c-traded-goods.component';

const routes: Routes = [
  {
    path: '',
    component: CBcCTradedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBcMTradedGoodsRoutingModule {}
