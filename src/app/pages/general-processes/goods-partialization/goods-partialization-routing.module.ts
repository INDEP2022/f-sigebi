import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsPartializationComponent } from './goods-partialization/goods-partialization.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsPartializationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsPartializationRoutingModule {}
