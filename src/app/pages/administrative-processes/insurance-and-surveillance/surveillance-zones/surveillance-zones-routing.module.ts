import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SurveillanceZonesComponent } from './surveillance-zones/surveillance-zones.component';

const routes: Routes = [
  {
    path: '',
    component: SurveillanceZonesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SurveillanceZonesRoutingModule {}
