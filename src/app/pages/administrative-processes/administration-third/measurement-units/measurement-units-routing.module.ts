import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasurementUnitsComponent } from './measurement-units/measurement-units.component';

const routes: Routes = [
  {
    path: '',
    component: MeasurementUnitsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeasurementUnitsRoutingModule {}
