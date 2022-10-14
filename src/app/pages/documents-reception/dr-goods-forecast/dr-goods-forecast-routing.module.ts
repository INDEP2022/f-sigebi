import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrGoodsForecastComponent } from './dr-goods-forecast/dr-goods-forecast.component';

const routes: Routes = [
  {
    path: '',
    component: DrGoodsForecastComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrGoodsForecastRoutingModule {}
