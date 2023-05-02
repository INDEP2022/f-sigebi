import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppraisalGoodsComponent } from './appraisal-goods/appraisal-goods.component';

const routes: Routes = [
  {
    path: '',
    component: AppraisalGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppraisalGoodsRoutingModule {}
