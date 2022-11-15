import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpGoodsPartializationComponent } from './gp-goods-partialization/gp-goods-partialization.component';

const routes: Routes = [
  {
    path: '',
    component: GpGoodsPartializationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpGoodsPartializationRoutingModule {}
