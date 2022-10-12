import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrSatSaeGoodsLoadComponent } from './dr-sat-sae-goods-load/dr-sat-sae-goods-load.component';

const routes: Routes = [
  {
    path: '',
    component: DrSatSaeGoodsLoadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrSatSaeGoodsLoadRoutingModule {}
