import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsTypeCrimeReportsComponent } from './goods-type-crime-reports/goods-type-crime-reports.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsTypeCrimeReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsTypeCrimeRoutingModule {}
