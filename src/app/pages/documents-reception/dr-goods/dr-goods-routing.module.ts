import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrGoodsCaptureComponent } from './dr-goods-capture/dr-goods-capture.component';

const routes: Routes = [
  {
    path: '',
    component: DrGoodsCaptureComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrGoodsRoutingModule {}
