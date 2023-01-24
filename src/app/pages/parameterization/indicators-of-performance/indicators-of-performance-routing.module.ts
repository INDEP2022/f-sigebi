import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndicatorsOfPerformanceComponent } from './indicators-of-performance/indicators-of-performance.component';

const routes: Routes = [
  {
    path: '',
    component: IndicatorsOfPerformanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsOfPerformanceRoutingModule {}
