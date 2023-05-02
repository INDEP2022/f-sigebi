import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsCaptureComponent } from './goods-capture/goods-capture.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsCaptureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsRoutingModule {}
