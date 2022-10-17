import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaMrgCMassiveReclassificationGoodsComponent } from './pa-mrg-c-massive-reclassification-goods/pa-mrg-c-massive-reclassification-goods.component';

const routes: Routes = [
  {
    path: '',
    component: PaMrgCMassiveReclassificationGoodsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaMMassiveReclassificationGoodsRoutingModule { }
