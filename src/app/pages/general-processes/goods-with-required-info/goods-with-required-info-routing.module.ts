import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsWithRequiredInfoComponent } from './goods-with-required-info/goods-with-required-info.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsWithRequiredInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsWithRequiredInfoRoutingModule {}
