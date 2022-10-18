import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaGrsCGoodsReviewStatusComponent } from './goods-review-status/pa-grs-c-goods-review-status.component';

const routes: Routes = [
  {
    path: '',
    component: PaGrsCGoodsReviewStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaGtMGoodsTrackingRoutingModule {}
