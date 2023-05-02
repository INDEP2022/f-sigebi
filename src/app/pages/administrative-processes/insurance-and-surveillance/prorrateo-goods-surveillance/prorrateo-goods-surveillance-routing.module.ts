import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProrrateoGoodsSurveillanceComponent } from './prorrateo-goods-surveillance/prorrateo-goods-surveillance.component';

const routes: Routes = [
  {
    path: '',
    component: ProrrateoGoodsSurveillanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProrrateoGoodsSurveillanceRoutingModule {}
