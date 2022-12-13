import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MassiveReclassificationGoodsComponent } from './massive-reclassification-goods/massive-reclassification-goods.component';

const routes: Routes = [
  {
    path: '',
    component: MassiveReclassificationGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MassiveReclassificationGoodsRoutingModule {}
