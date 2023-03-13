import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConcentrateGoodsTypeComponent } from './concentrate-goods-type/concentrate-goods-type.component';

const routes: Routes = [
  {
    path: '',
    component: ConcentrateGoodsTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConcentrateGoodsTypeRoutingModule {}
