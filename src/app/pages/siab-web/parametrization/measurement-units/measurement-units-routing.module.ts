import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MeasurementUnitsListComponent } from './measurement-units-list/measurement-units-list.component';

const routes: Routes = [
  {
    path: '',
    component: MeasurementUnitsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MeasurementUnitsRoutingModule {}
