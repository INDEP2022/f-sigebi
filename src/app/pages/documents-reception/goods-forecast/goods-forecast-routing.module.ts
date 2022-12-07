import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoodsForecastComponent } from './goods-forecast/goods-forecast.component';

const routes: Routes = [
  {
    path: '',
    component: GoodsForecastComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GoodsForecastRoutingModule {}
