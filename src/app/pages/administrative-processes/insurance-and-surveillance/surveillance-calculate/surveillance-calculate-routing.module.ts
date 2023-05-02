import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceCalculateComponent } from './surveillance-calculate/surveillance-calculate.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceCalculateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceCalculateRoutingModule {}
