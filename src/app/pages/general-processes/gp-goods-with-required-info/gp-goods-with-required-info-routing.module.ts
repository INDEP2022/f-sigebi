import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpGoodsWithRequiredInfoComponent } from './gp-goods-with-required-info/gp-goods-with-required-info.component';

const routes: Routes = [
  {
    path: '',
    component: GpGoodsWithRequiredInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpGoodsWithRequiredInfoRoutingModule {}
