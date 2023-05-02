import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostsAppliedGoodsComponent } from './costs-applied-goods/costs-applied-goods.component';

const routes: Routes = [
  {
    path: '',
    component: CostsAppliedGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostsAppliedGoodsRoutingModule {}
