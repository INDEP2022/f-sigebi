import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PerformanceIndicatorDetailComponent } from './performance-indicator-detail/performance-indicator-detail.component';

const routes: Routes = [
  {
    path: '',
    component: PerformanceIndicatorDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerformanceIndicatorDetailRoutingModule {}
