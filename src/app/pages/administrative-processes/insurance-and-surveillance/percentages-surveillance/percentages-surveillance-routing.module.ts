import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PercentagesSurveillanceComponent } from './percentages-surveillance/percentages-surveillance.component';

const routes: Routes = [
  {
    path: '',
    component: PercentagesSurveillanceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PercentagesSurveillanceRoutingModule {}
