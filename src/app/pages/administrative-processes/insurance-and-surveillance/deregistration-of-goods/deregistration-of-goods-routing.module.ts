import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeregistrationOfGoodsComponent } from './deregistration-of-goods/deregistration-of-goods.component';

const routes: Routes = [
  {
    path: '',
    component: DeregistrationOfGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeregistrationOfGoodsRoutingModule {}
