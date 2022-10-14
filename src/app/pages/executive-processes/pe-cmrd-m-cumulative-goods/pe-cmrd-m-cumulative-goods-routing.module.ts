import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeCmrdCCumulativeGoodsComponent } from './pe-cmrd-c-cumulative-goods/pe-cmrd-c-cumulative-goods.component';

const routes: Routes = [
  {
    path: '',
    component: PeCmrdCCumulativeGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeCmrdMCumulativeGoodsRoutingModule {}
