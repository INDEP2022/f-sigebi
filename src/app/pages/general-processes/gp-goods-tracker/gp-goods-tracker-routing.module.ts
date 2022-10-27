import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpGoodsTrackerComponent } from './gp-goods-tracker/gp-goods-tracker.component';

const routes: Routes = [
  {
    path: '',
    component: GpGoodsTrackerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpGoodsTrackerRoutingModule {}
