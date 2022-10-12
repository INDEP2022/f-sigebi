import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrGoodsBulkLoadComponent } from './dr-goods-bulk-load/dr-goods-bulk-load.component';

const routes: Routes = [
  {
    path: '',
    component: DrGoodsBulkLoadComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrGoodsBulkLoadRoutingModule {}
