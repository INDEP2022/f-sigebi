import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CumulativeGoodsComponent } from './cumulative-goods/cumulative-goods.component';

const routes: Routes = [
  {
    path: '',
    component: CumulativeGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CumulativeGoodsRoutingModule {}
