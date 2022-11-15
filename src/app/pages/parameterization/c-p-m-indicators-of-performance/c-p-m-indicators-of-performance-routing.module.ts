import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMIndicatorsOfPerformanceComponent } from './c-p-m-indicators-of-performance/c-p-m-indicators-of-performance.component';

const routes: Routes = [
  {
    path: '',
    component: CPMIndicatorsOfPerformanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMIndicatorsOfPerformanceRoutingModule {}
