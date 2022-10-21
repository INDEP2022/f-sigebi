import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccumulatedMonthlyAssetsComponent } from './accumulated-monthly-assets/accumulated-monthly-assets.component';

const routes: Routes = [
  {
    path: '',
    component: AccumulatedMonthlyAssetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccumulatedMonthlyAssetsRoutingModule {}
