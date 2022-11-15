import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceIndicatorComponent } from './performance-indicator/performance-indicator.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceIndicatorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceIndicatorRoutingModule {}
