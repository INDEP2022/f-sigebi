import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LossOfGoodsPolicyComponent } from './loss-of-goods-policy/loss-of-goods-policy.component';

const routes: Routes = [
  {
    path: '',
    component: LossOfGoodsPolicyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LossOfGoodsPolicyRoutingModule {}
