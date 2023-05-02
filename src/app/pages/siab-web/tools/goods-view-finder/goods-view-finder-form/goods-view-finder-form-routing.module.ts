import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsViewFinderFormComponent } from './goods-view-finder-form/goods-view-finder-form.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsViewFinderFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsViewFinderFormRoutingModule {}
