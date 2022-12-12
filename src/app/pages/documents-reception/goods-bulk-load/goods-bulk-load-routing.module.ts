import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsBulkLoadComponent } from './goods-bulk-load/goods-bulk-load.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsBulkLoadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsBulkLoadRoutingModule {}
