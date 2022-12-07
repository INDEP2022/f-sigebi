import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsTrackerComponent } from './goods-tracker/goods-tracker.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsTrackerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsTrackerRoutingModule {}
