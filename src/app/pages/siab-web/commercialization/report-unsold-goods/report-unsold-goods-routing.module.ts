import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportUnsoldGoodsComponent } from './report-unsold-goods/report-unsold-goods.component';

const routes: Routes = [
  {
    path: '',
    component: ReportUnsoldGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportUnsoldGoodsRoutingModule {}
