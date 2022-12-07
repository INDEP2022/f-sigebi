import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsultGoodsComponent } from './consult-goods/consult-goods.component';

const routes: Routes = [
  {
    path: '',
    component: ConsultGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultGoodsRoutingModule {}
