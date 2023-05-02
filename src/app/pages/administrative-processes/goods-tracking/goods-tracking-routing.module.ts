import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { GoodsReviewStatusComponent } from './goods-review-status/goods-review-status.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsReviewStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsTrackingRoutingModule {}
