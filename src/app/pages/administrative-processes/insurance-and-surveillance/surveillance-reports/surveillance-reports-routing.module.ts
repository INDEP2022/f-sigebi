import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceReportsComponent } from './surveillance-reports/surveillance-reports.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceReportsRoutingModule {}
